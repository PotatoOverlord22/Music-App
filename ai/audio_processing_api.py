import numpy as np
import tempfile
from flask import Flask, request, send_file, jsonify
import json

from audio_processing_service import (
    load_audio,
    create_eq_profile,
    process_audio_in_segments,
    save_audio,
    process_audio_with_genre_bias,
    extract_audio_features,
    scaler,
    mood_encoder,
    time_encoder,
    recommender_model,
    genre_encoder,
    MOOD_MAP,
    TIME_MAP
)

#   run with: & c:/venvs/ai/Scripts/python.exe c:/Users/rauli/licenta/app/ai/ai_audio_processing.py
app = Flask(__name__)

@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    intensity = float(request.form.get('intensity', 1.0))
    segment_duration = int(request.form.get('segment_duration', 30))
    overlap = float(request.form.get('overlap', 5))
    print(f"params with recom: {intensity=}, {segment_duration=}, {overlap=}")

    genre_presets = load_genre_presets_from_request(request)
    print(f"genre_presets: {genre_presets}")

    try:
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_input:
            file.save(temp_input.name)
            
            audio, sr = load_audio(temp_input.name)
            center_freqs, _ = create_eq_profile(num_bands=10, sr=sr)
            processed_audio = process_audio_in_segments(
                audio, sr, center_freqs, 
                segment_duration=segment_duration, 
                overlap=overlap, 
                intensity=intensity,
                genre_presets=genre_presets
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

@app.route('/process_audio_with_recommendation', methods=['POST'])
def process_audio_with_recommendation():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    user_mood = request.form.get('mood')
    user_time = request.form.get('time_of_day')
    if not user_mood or not user_time:
        return jsonify({'error': 'Mood and time_of_day are required'}), 400
    
    intensity = float(request.form.get('intensity', 1.0))
    segment_duration = int(request.form.get('segment_duration', 30))
    overlap = float(request.form.get('overlap', 5.0))
    bias = float(request.form.get('context_bias', 0.2))
    use_recommendation = request.form.get('use_recommendation', 'true').lower() == 'true'
    genre_presets = load_genre_presets_from_request(request)
    print(f"genre_presets: {genre_presets}")

    print(f"params with recom: {user_mood=}, {user_time=}, {bias=}, {intensity=}, {segment_duration=}, {overlap=}, {use_recommendation=}")
    
    try:
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_input:
            file.save(temp_input.name)
            input_path = temp_input.name
        
        audio, sr = load_audio(input_path)
        center_freqs, _ = create_eq_profile(num_bands=10, sr=sr)
        
        recommended_genre = None
        if use_recommendation:
            feats = extract_audio_features(input_path)
            
            num_cols = ['popularity', 'release', 'danceability', 'energy', 'valence', 'tempo', 'duration_ms']
            audio_vec = [feats[col] for col in num_cols]
            
            if user_mood not in MOOD_MAP:
                return jsonify({'error': f'Invalid mood. Must be one of: {MOOD_MAP}'}), 400
            if user_time not in TIME_MAP:
                return jsonify({'error': f'Invalid time of day. Must be one of: {TIME_MAP}'}), 400
            
            audio_scaled = scaler.transform(np.array(audio_vec).reshape(1, -1))
            mood_vec = mood_encoder.transform([[user_mood]])
            time_vec = time_encoder.transform([[user_time]])
            context = np.hstack([mood_vec, time_vec])
            
            probs = recommender_model.predict({'audio_input': audio_scaled, 'context_input': context})[0]
            top_idx = np.argmax(probs)
            recommended_genre = genre_encoder.categories_[0][top_idx]
            print(f"Recommended genre based on audio features and context: {recommended_genre}")
        
        if recommended_genre and use_recommendation:
            processed_audio = process_audio_with_genre_bias(
                audio, sr, center_freqs, 
                recommended_genre=recommended_genre,
                segment_duration=segment_duration, 
                overlap=overlap, 
                intensity=intensity,
                bias=bias,
                genre_presets=genre_presets
            )
        else:
            processed_audio = process_audio_in_segments(
                audio, sr, center_freqs, 
                segment_duration=segment_duration, 
                overlap=overlap, 
                intensity=intensity,
                genre_presets=genre_presets
            )
        
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_output:
            save_audio(processed_audio, sr, temp_output.name)
            
            response = send_file(
                temp_output.name,
                mimetype='audio/mpeg',
                as_attachment=True,
                download_name=f"smart_eq_{file.filename}"
            )
            
            if recommended_genre:
                response.headers['X-Recommended-Genre'] = recommended_genre
            
            return response
            
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    
@app.route('/recommend_genre', methods=['POST'])
def recommend_genre_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    genre_presets = load_genre_presets_from_request(request)
    print(f"genre_presets: {genre_presets}")
    
    user_mood = request.form.get('mood')
    user_time = request.form.get('time_of_day')
    if not user_mood or not user_time:
        return jsonify({'error': 'Mood and time_of_day are required'}), 400
    
    try:
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            file.save(tmp.name)
            feats = extract_audio_features(tmp.name)
        
        num_cols = ['popularity', 'release', 'danceability', 'energy', 'valence', 'tempo', 'duration_ms']
        audio_vec = [feats[col] for col in num_cols]
        
        print(f"Extracted features: {feats}")

        audio_scaled = scaler.transform(np.array(audio_vec).reshape(1, -1))
        
        if user_mood not in MOOD_MAP:
            return jsonify({'error': f'Invalid mood. Must be one of: {MOOD_MAP}'}), 400
        if user_time not in TIME_MAP:
            return jsonify({'error': f'Invalid time of day. Must be one of: {TIME_MAP}'}), 400
            
        mood_vec = mood_encoder.transform([[user_mood]])
        time_vec = time_encoder.transform([[user_time]])
        context = np.hstack([mood_vec, time_vec])
        
        print(f"Audio features: {audio_scaled.shape}, Context: {context.shape}")

        probs = recommender_model.predict({'audio_input': audio_scaled, 'context_input': context})[0]
        
        top_idx = np.argmax(probs)
        top_genre = genre_encoder.categories_[0][top_idx]
        
        results = {
            'recommended_genre': top_genre
        }

        return jsonify(results)
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    
def load_genre_presets_from_request(request):
    if 'genre_presets' in request.form:
        genre_presets_json = request.form.get('genre_presets')
    elif 'genre_presets' in request.files:
        file = request.files['genre_presets']
        genre_presets_json = file.read().decode('utf-8') # Read content from file
    else:
        return None
    try:
        list_of_presets = json.loads(genre_presets_json)

        transformed_presets = {}
        for preset_item in list_of_presets:
            genre_name = preset_item.get('GenreName')
            values = preset_item.get('Values', [])
            
            gains = [0.0] * len(values)
            for val in values:
                band_index = val.get('BandIndex')
                gain = val.get('Gain')
                if band_index is not None and gain is not None and 0 <= band_index < len(gains):
                    gains[band_index] = float(gain)
            
            if genre_name:
                transformed_presets[genre_name.lower()] = gains

        return transformed_presets

    except json.JSONDecodeError as e:
        print(f"Failed to parse genre_presets JSON: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred while processing genre_presets: {e}")
        return None

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)