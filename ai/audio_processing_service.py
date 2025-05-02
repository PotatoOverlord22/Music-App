import os
import numpy as np
import librosa
import tensorflow as tf
import soundfile as sf
import tempfile
from flask import Flask, request, send_file, jsonify
from scipy import signal
from scipy.stats import hmean
from io import BytesIO
import pickle


CONEqNET_PATH = "./saved_models/CONEqNet.keras"
RECOMMENDER_DIR = "./saved_models/genre_recommender"

if os.path.exists(CONEqNET_PATH):
    coneq_model = tf.keras.models.load_model(CONEqNET_PATH)
    print(f"Loaded CONEqNet model from {CONEqNET_PATH}")
else:
    raise FileNotFoundError(f"Model file not found at {CONEqNET_PATH}")

if os.path.exists(RECOMMENDER_DIR):
    recommender_model = tf.keras.models.load_model(RECOMMENDER_DIR)
    print(f"Loaded recommender model from {RECOMMENDER_DIR}")
    
    with open(os.path.join(RECOMMENDER_DIR, 'scaler.pkl'), 'rb') as f:
        scaler = pickle.load(f)
    
    with open(os.path.join(RECOMMENDER_DIR, 'mood_encoder.pkl'), 'rb') as f:
        mood_encoder = pickle.load(f)
    
    with open(os.path.join(RECOMMENDER_DIR, 'time_encoder.pkl'), 'rb') as f:
        time_encoder = pickle.load(f)
    
    with open(os.path.join(RECOMMENDER_DIR, 'genre_encoder.pkl'), 'rb') as f:
        genre_encoder = pickle.load(f)
    
    print("Loaded encoders and scaler")
else:
    raise FileNotFoundError(f"Model directory not found at {RECOMMENDER_DIR}")

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
    mfcc = mfcc.T
    
    if mfcc.shape[0] < target_frames:
        pad_width = target_frames - mfcc.shape[0]
        mfcc = np.pad(mfcc, ((0, pad_width), (0, 0)), mode='constant')
    elif mfcc.shape[0] > target_frames:
        mfcc = mfcc[:target_frames, :]
    
    mfcc = mfcc[..., np.newaxis]
    return np.expand_dims(mfcc, axis=0)

def create_eq_profile(num_bands=10, min_freq=20, max_freq=22050, sr=44100):
    """Create an equalization profile with specified number of bands."""
    max_freq = min(max_freq, sr // 2 - 1)
    center_freqs = np.logspace(np.log10(min_freq), np.log10(max_freq), num_bands)
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
        
        if len(segment) < sr:
            continue
            
        x_input = process_segment(segment, sr, target_frames=600, n_mfcc=13, hop_length=1103)
        pred = coneq_model.predict(x_input, verbose=0)  # Use coneq_model here, not model
        genre_index = np.argmax(pred)
        genre_preset = genres[genre_index]
        print(f"Predicted genre for segment {i+1}: {genre_preset}")

        gains = apply_eq_preset(genre_preset, intensity=intensity)
        processed_segment = apply_eq_fft(segment, sr, center_freqs, gains)
        
        window = np.ones(len(segment))
        if i > 0:
            window[:fade_len] = fade_in
        if i < num_segments - 1 and len(segment) >= fade_len:
            window[-fade_len:] = fade_out
        
        processed_segment *= window
        processed_audio[start_idx:end_idx] += processed_segment
        normalization[start_idx:end_idx] += window
    
    mask = normalization > 0
    processed_audio[mask] /= normalization[mask]
    return processed_audio

def save_audio(audio, sr, file_path):
    """Save audio to file."""
    max_amplitude = np.max(np.abs(audio))
    normalized_audio = audio / max_amplitude * 0.95 if max_amplitude > 0 else audio
    sf.write(file_path, normalized_audio, sr)
    print(f"Saved equalized audio to {file_path}")
    
def extract_audio_features(path):
    y, sr = librosa.load(path, sr=22050, mono=True)
    duration = librosa.get_duration(y=y, sr=sr)  # in seconds

    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    ibis = np.diff(librosa.frames_to_time(beat_frames, sr=sr))
    danceability = 1.0 / (1.0 + np.std(ibis) / np.mean(ibis)) if len(ibis) > 0 else 0.5

    rms = librosa.feature.rms(y=y)[0]
    energy = np.mean(rms)

    cent = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    contrast = librosa.feature.spectral_contrast(y=y, sr=sr)[0]
    valence = (np.mean(cent) / np.max(cent) + np.mean(contrast) / np.max(contrast)) / 2

    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    chroma_avg = np.mean(chroma, axis=1)
    key_idx = chroma_avg.argmax()
    major_third = chroma_avg[(key_idx + 4) % 12]
    minor_third = chroma_avg[(key_idx + 3) % 12]
    mode = 1 if major_third > minor_third else 0

    return {
        'popularity': 50.0,
        'release': 2000,
        'danceability': float(danceability),
        'energy': float(energy),
        'valence': float(valence),
        'tempo': float(tempo),
        'key': int(key_idx),
        'mode': int(mode),
        'duration_ms': int(duration * 1000)
    }
    
MOOD_MAP = ['angry', 'dreamy', 'emotional', 'energetic', 'happy', 'intense', 'peaceful', 'relaxed', 'romantic', 'sad']
TIME_MAP = ['morning', 'afternoon', 'evening', 'night']
GENRE_LIST = ['blues', 'classical', 'country', 'disco', 'hiphop', 'jazz', 'metal', 'pop', 'reggae', 'rock']

def one_hot_encode(value, categories):
    """Manually create one-hot encoding for a value."""
    vec = [1.0 if value == cat else 0.0 for cat in categories]
    if sum(vec) == 0:
        raise ValueError(f"Value '{value}' not found in categories {categories}")
    return vec

def process_audio_with_genre_bias(audio, sr, center_freqs, recommended_genre=None, 
                                segment_duration=30, overlap=3, intensity=1.0, bias=0.2):
    """
    Process audio in segments with overlap, biasing towards the recommended genre.
    This combines CONEqNet predictions with the recommendation model's genre suggestion.
    """
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
    
    recommended_gains = apply_eq_preset(recommended_genre, intensity=intensity*0.6)
    
    print(f"Processing audio in {num_segments} segments with genre bias towards {recommended_genre}...")
    for i in range(num_segments):
        start_idx = i * hop_length
        end_idx = min(start_idx + segment_length, total_samples)
        if start_idx >= total_samples:
            break

        segment = audio[start_idx:end_idx]
        
        if len(segment) < sr:
            continue
            
        x_input = process_segment(segment, sr, target_frames=600, n_mfcc=13, hop_length=1103)
        pred = coneq_model.predict(x_input, verbose=0)
        genre_index = np.argmax(pred)
        predicted_genre = GENRE_LIST[genre_index]
        print(f"Predicted genre for segment {i+1}: {predicted_genre}")
        predicted_gains = apply_eq_preset(predicted_genre, intensity=intensity*0.6)
        
        blended_gains = bias * recommended_gains + (1-bias) * predicted_gains
        
        processed_segment = apply_eq_fft(segment, sr, center_freqs, blended_gains)
        
        window = np.ones(len(segment))
        if i > 0:
            window[:fade_len] = fade_in
        if i < num_segments - 1 and len(segment) >= fade_len:
            window[-fade_len:] = fade_out
        
        processed_segment *= window
        processed_audio[start_idx:end_idx] += processed_segment
        normalization[start_idx:end_idx] += window
    
    mask = normalization > 0
    processed_audio[mask] /= normalization[mask]
    return processed_audio