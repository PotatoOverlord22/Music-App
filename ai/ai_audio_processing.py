import os
import numpy as np
import librosa
import tensorflow as tf
import soundfile as sf
from flask import Flask, request, send_file, jsonify
from scipy import signal
from io import BytesIO
import tempfile

#
#   Run with command from current folder: & c:/venvs/ai/Scripts/python.exe c:/Users/rauli/licenta/app/ai/ai_audio_processing.py
#

app = Flask(__name__)

MODEL_PATH = "./saved_models/CONEqNet.keras"
if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Loaded model from {MODEL_PATH}")
else:
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

def load_audio(file_path, sr=44100):
    """Load an audio file and return the audio time series and sampling rate."""
    try:
        audio, sr = librosa.load(file_path, sr=sr)
        print(f"Successfully loaded audio: {len(audio)/sr:.2f} seconds at {sr} Hz")
        return audio, sr
    except Exception as e:
        print(f"Error loading audio file: {e}")
        return np.zeros(sr), sr

def extract_mfcc_from_segment(segment, sr, n_mfcc=13, hop_length=1103):
    """Extract MFCC features from an audio segment."""
    mfcc = librosa.feature.mfcc(y=segment, sr=sr, n_mfcc=n_mfcc, hop_length=hop_length)
    return mfcc

def process_segment(segment, sr, target_frames=600, n_mfcc=13, hop_length=1103):
    """Process an audio segment to extract MFCC features and prepare them for prediction."""
    mfcc = extract_mfcc_from_segment(segment, sr, n_mfcc, hop_length)
    mfcc = mfcc.T  # now shape is (n_frames, n_mfcc)
    
    # Pad or truncate to ensure exactly target_frames are present
    if mfcc.shape[0] < target_frames:
        pad_width = target_frames - mfcc.shape[0]
        mfcc = np.pad(mfcc, ((0, pad_width), (0, 0)), mode='constant')
    elif mfcc.shape[0] > target_frames:
        mfcc = mfcc[:target_frames, :]
    
    # Add channel dimension -> (target_frames, n_mfcc, 1)
    mfcc = mfcc[..., np.newaxis]
    # Add batch dimension -> (1, target_frames, n_mfcc, 1)
    return np.expand_dims(mfcc, axis=0)

def create_eq_profile(num_bands=10, min_freq=20, max_freq=22050, sr=44100):
    """Create an equalization profile with specified number of bands."""
    # Ensure max_freq doesn't exceed Nyquist frequency
    max_freq = min(max_freq, sr // 2 - 1)
    
    # Create logarithmically spaced center frequencies
    center_freqs = np.logspace(np.log10(min_freq), np.log10(max_freq), num_bands)
    
    # Initialize gains to 0 dB (no change)
    gains = np.zeros(num_bands)
    
    return center_freqs, gains

def apply_eq_preset(preset_name, intensity=1.0):
    """Return gain values for common EQ presets."""
    genre_presets = {
        'blues':     [-1,  0,  2,  2,  1,  0, -1,  0,  1,  1],
        'classical': [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        'country':   [ 0,  1,  1,  2,  1,  0,  0,  0,  0,  0],
        'disco':     [ 2,  3,  2,  1,  0,  0,  1,  2,  3,  2],
        'hiphop':    [ 3,  4,  2,  0, -1, -1,  0,  1,  1,  0],
        'jazz':      [ 0,  1,  1,  2,  2,  1,  0,  0,  1,  0],
        'metal':     [ 2,  3,  0, -3, -4, -3,  0,  3,  3,  2],
        'pop':       [ 0,  1,  2,  2,  1,  0,  1,  1,  2,  2],
        'reggae':    [ 0,  1,  0,  0, -1, -1,  0,  0,  1,  0],
        'rock':      [ 1,  1,  0,  0,  1,  1,  0,  0,  1,  1]
    }
    
    if preset_name in genre_presets:
        return np.array(genre_presets[preset_name]) * intensity
    else:
        print(f"Preset '{preset_name}' not found. Defaulting to no change.")
        return np.zeros(10)

def apply_eq_fft(audio, sr, center_freqs, gains):
    """Apply equalization using FFT-based method."""
    n_fft = 2048  # Next power of 2 for efficient FFT
    stft = librosa.stft(audio, n_fft=n_fft)
    magnitude, phase = librosa.magphase(stft)
    freq_bins = librosa.fft_frequencies(sr=sr, n_fft=n_fft)
    
    # Create an equalization curve (default no change)
    eq_curve = np.ones_like(freq_bins)
    
    for center_freq, gain_db in zip(center_freqs, gains):
        gain_linear = 10 ** (gain_db / 20)
        lower_freq = center_freq / np.sqrt(2)
        upper_freq = center_freq * np.sqrt(2)
        band_indices = np.where((freq_bins >= lower_freq) & (freq_bins <= upper_freq))
        eq_curve[band_indices] *= gain_linear
    
    eq_magnitude = magnitude * eq_curve[:, np.newaxis]
    eq_stft = eq_magnitude * phase
    eq_audio = librosa.istft(eq_stft, length=len(audio))
    return eq_audio

def process_audio_in_segments(audio, sr, center_freqs, segment_duration=30, overlap=3, intensity=1.0):
    """Process audio in segments with overlap to avoid artifacts at boundaries."""
    segment_length = int(segment_duration * sr)
    overlap_length = int(overlap * sr)
    hop_length = segment_length - overlap_length
    total_samples = len(audio)
    num_segments = int(np.ceil((total_samples - overlap_length) / hop_length)) + 1
    
    processed_audio = np.zeros_like(audio)
    normalization = np.zeros_like(audio)
    
    fade_len = overlap_length
    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)

    genres = ['blues', 'classical', 'country', 'disco', 'hiphop',
              'jazz', 'metal', 'pop', 'reggae', 'rock']
    
    print(f"Processing audio in {num_segments} segments...")
    for i in range(num_segments):
        start_idx = i * hop_length
        end_idx = min(start_idx + segment_length, total_samples)
        if start_idx >= total_samples:
            break

        segment = audio[start_idx:end_idx]
        
        # Skip very short segments
        if len(segment) < sr:
            continue
            
        x_input = process_segment(segment, sr, target_frames=600, n_mfcc=13, hop_length=1103)
        pred = model.predict(x_input, verbose=0)
        genre_index = np.argmax(pred)
        genre_preset = genres[genre_index]
        print(f"Predicted genre for segment {i+1}: {genre_preset}")

        gains = apply_eq_preset(genre_preset, intensity=intensity)
        processed_segment = apply_eq_fft(segment, sr, center_freqs, gains)
        
        # Apply fade-in and fade-out to avoid artifacts
        window = np.ones(len(segment))
        if i > 0:
            window[:fade_len] = fade_in
        if i < num_segments - 1 and len(segment) >= fade_len:
            window[-fade_len:] = fade_out
        
        processed_segment *= window
        processed_audio[start_idx:end_idx] += processed_segment
        normalization[start_idx:end_idx] += window
    
    # Normalize the overlapping segments
    mask = normalization > 0
    processed_audio[mask] /= normalization[mask]
    return processed_audio

def save_audio(audio, sr, file_path):
    """Save audio to file."""
    max_amplitude = np.max(np.abs(audio))
    normalized_audio = audio / max_amplitude * 0.95 if max_amplitude > 0 else audio
    sf.write(file_path, normalized_audio, sr)
    print(f"Saved equalized audio to {file_path}")

# Flask endpoint
@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    intensity = float(request.form.get('intensity', 5.0))
    segment_duration = int(request.form.get('segment_duration', 30))
    overlap = int(request.form.get('overlap', 5))
    
    try:
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_input:
            file.save(temp_input.name)
            
            audio, sr = load_audio(temp_input.name)
            center_freqs, _ = create_eq_profile(num_bands=10, sr=sr)
            processed_audio = process_audio_in_segments(
                audio, sr, center_freqs, 
                segment_duration=segment_duration, 
                overlap=overlap, 
                intensity=intensity
            )
            
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_output:
                save_audio(processed_audio, sr, temp_output.name)
                
                return send_file(
                    temp_output.name,
                    mimetype='audio/mpeg',
                    as_attachment=True,
                    download_name=f"processed_{file.filename}"
                )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)