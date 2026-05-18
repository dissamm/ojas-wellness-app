from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json
import os
from datetime import datetime
import ephem

app = Flask(__name__)
CORS(app)

# Get the directory where this script is located
base_dir = os.path.dirname(os.path.abspath(__file__))

# Look for model files in models folder or root
models_dir = os.path.join(base_dir, 'models')

# Try to load model from models folder first
model_path = os.path.join(models_dir, 'mood_predictor.pkl')
scaler_path = os.path.join(models_dir, 'mood_scaler.pkl')
features_path = os.path.join(models_dir, 'model_features.json')

# If not found, try root directory
if not os.path.exists(model_path):
    model_path = os.path.join(base_dir, 'mood_predictor.pkl')
    scaler_path = os.path.join(base_dir, 'mood_scaler.pkl')
    features_path = os.path.join(base_dir, 'model_features.json')

print("=" * 50)
print("🌙 Cosmic Wellness API Server")
print("=" * 50)
print(f"Looking for model at: {model_path}")

# Load the model
try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    with open(features_path, 'r') as f:
        features = json.load(f)
    print(f"✅ Model loaded successfully!")
    print(f"✅ Features: {features}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    scaler = None

def calculate_lunar_phase(date_str):
    """Calculate lunar sin/cos for a given date"""
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d')
        observer = ephem.Observer()
        observer.date = date.strftime('%Y/%m/%d')
        moon = ephem.Moon(observer)
        lunar_days = float(moon.moon_phase) * 29.53
        lunar_sin = np.sin(2 * np.pi * lunar_days / 29.53)
        lunar_cos = np.cos(2 * np.pi * lunar_days / 29.53)
        return lunar_sin, lunar_cos
    except:
        return 0, 1

def get_moon_phase_name(lunar_sin, lunar_cos):
    """Convert lunar sin/cos to readable moon phase name"""
    angle = np.arctan2(lunar_sin, lunar_cos)
    angle_deg = np.degrees(angle)
    if angle_deg < 0:
        angle_deg += 360
    
    if angle_deg < 45 or angle_deg >= 315:
        return "New Moon"
    elif angle_deg < 90:
        return "Waxing Crescent"
    elif angle_deg < 135:
        return "First Quarter"
    elif angle_deg < 180:
        return "Waxing Gibbous"
    elif angle_deg < 225:
        return "Full Moon"
    elif angle_deg < 270:
        return "Waning Gibbous"
    elif angle_deg < 315:
        return "Last Quarter"
    else:
        return "Waning Crescent"

def get_moon_illumination(lunar_sin, lunar_cos):
    """Calculate moon illumination percentage"""
    angle = np.arctan2(lunar_sin, lunar_cos)
    illumination = (1 + np.cos(angle)) / 2
    return illumination * 100

def get_phase_from_day(cycle_day):
    """Convert cycle day (1-28) to phase number (1-4)"""
    if cycle_day <= 5:
        return 4  # Menstrual
    elif cycle_day <= 14:
        return 1  # Follicular
    elif cycle_day <= 16:
        return 2  # Ovulation
    else:
        return 3  # Luteal

def get_phase_name(phase_num):
    phases = {1: 'Follicular', 2: 'Ovulation', 3: 'Luteal', 4: 'Menstrual'}
    return phases.get(phase_num, 'Unknown')

# ============================================
# PRAKRITI-BASED MUSIC LIBRARY
# ============================================
PRAKRITI_MUSIC_LIBRARY = {
    'Vata': {
        'high_mood': {
            'songs': ["Feeling Good - Nina Simone", "Here Comes the Sun - Beatles", "Don't Worry Be Happy - Bobby McFerrin"],
            'genres': ['World Music', 'Folk', 'Acoustic', 'Reggae']
        },
        'medium_mood': {
            'songs': ["Weightless - Marconi Union", "Grounded - Beautiful Chorus", "Mountain Lullaby - Liquid Mind"],
            'genres': ['Ambient', 'Meditation', 'Folk']
        },
        'low_mood': {
            'songs': ["Om Mantra - Deva Premal", "Healing Frequency 528Hz", "Moola Mantra"],
            'genres': ['Meditation', 'Healing', 'Mantra']
        }
    },
    'Pitta': {
        'high_mood': {
            'songs': ["Happy - Pharrell Williams", "Good as Hell - Lizzo", "Can't Stop the Feeling - Justin Timberlake"],
            'genres': ['Pop', 'Funk', 'Soul']
        },
        'medium_mood': {
            'songs': ["Waterfall - Relaxation Ensemble", "Cooling Waves - Meditation Spa", "Clair de Lune - Debussy"],
            'genres': ['Classical', 'Instrumental', 'Ambient']
        },
        'low_mood': {
            'songs': ["River Flows in You - Yiruma", "Gymnopédie No.1 - Satie", "Experience - Ludovico Einaudi"],
            'genres': ['Classical', 'Piano', 'Meditation']
        }
    },
    'Kapha': {
        'high_mood': {
            'songs': ["Uptown Funk - Bruno Mars", "Blinding Lights - The Weeknd", "Levitating - Dua Lipa"],
            'genres': ['Pop', 'Dance', 'EDM', 'Funk']
        },
        'medium_mood': {
            'songs': ["Rises the Moon - Liana Flores", "Buddy - Willow Smith", "Sunflower - Post Malone"],
            'genres': ['Lofi', 'Indie', 'Acoustic']
        },
        'low_mood': {
            'songs': ["Energize - Morning Workout", "Rise Up - Andra Day", "Stronger - Kelly Clarkson"],
            'genres': ['Motivational', 'Pop', 'Rock']
        }
    }
}

CYCLE_PHASE_MUSIC = {
    1: {  # Follicular
        'songs': ["Happy - Pharrell Williams", "Good as Hell - Lizzo"],
        'genres': ['Pop', 'Indie', 'Folk']
    },
    2: {  # Ovulation
        'songs': ["Girl on Fire - Alicia Keys", "Run the World - Beyoncé"],
        'genres': ['Dance', 'Hip Hop', 'Pop']
    },
    3: {  # Luteal
        'songs': ["Stay - Rihanna", "Someone Like You - Adele"],
        'genres': ['Ballad', 'Ambient', 'Chill']
    },
    4: {  # Menstrual
        'songs': ["Healing - Reiki Music", "Om Namah Shivaya"],
        'genres': ['Meditation', 'Healing', 'Classical']
    }
}

BASE_MUSIC = {
    'high_mood': {
        'songs': ["Blinding Lights - The Weeknd", "Levitating - Dua Lipa", "Dance Monkey - Tones and I"],
        'genres': ['Pop', 'Dance', 'EDM']
    },
    'medium_mood': {
        'songs': ["Weightless - Marconi Union", "Here Comes the Sun - The Beatles", "Rises the Moon - Liana Flores"],
        'genres': ['Lofi', 'Acoustic', 'Ambient']
    },
    'low_mood': {
        'songs': ["Clair de Lune - Debussy", "River Flows in You - Yiruma", "Gymnopédie No.1 - Satie"],
        'genres': ['Classical', 'Meditation', 'Piano']
    }
}

def recommend_music_hybrid(mood_score, phase_num, prakriti='Pitta'):
    """Hybrid music recommendation combining Prakriti, Cycle Phase, and Mood"""
    
    # Determine mood level
    if mood_score >= 7:
        mood_level = 'high_mood'
    elif mood_score >= 4:
        mood_level = 'medium_mood'
    else:
        mood_level = 'low_mood'
    
    all_songs = []
    all_genres = []
    
    # 1. Add Prakriti-based songs
    if prakriti in PRAKRITI_MUSIC_LIBRARY:
        prakriti_data = PRAKRITI_MUSIC_LIBRARY[prakriti]
        if mood_level in prakriti_data:
            all_songs.extend(prakriti_data[mood_level]['songs'])
            all_genres.extend(prakriti_data[mood_level]['genres'])
    
    # 2. Add Cycle Phase songs
    if phase_num in CYCLE_PHASE_MUSIC:
        phase_data = CYCLE_PHASE_MUSIC[phase_num]
        all_songs.extend(phase_data['songs'])
        all_genres.extend(phase_data['genres'])
    
    # 3. Add Base mood songs
    base_data = BASE_MUSIC.get(mood_level, BASE_MUSIC['medium_mood'])
    all_songs.extend(base_data['songs'])
    all_genres.extend(base_data['genres'])
    
    # Remove duplicates while preserving order
    unique_songs = []
    for song in all_songs:
        if song not in unique_songs:
            unique_songs.append(song)
    
    unique_genres = []
    for genre in all_genres:
        if genre not in unique_genres:
            unique_genres.append(genre)
    
    # Mood type description with Prakriti
    if mood_score >= 7:
        mood_type = f"Energetic & Vibrant ⚡ ({prakriti} Mode)"
    elif mood_score >= 4:
        mood_type = f"Balanced & Calming 🌿 ({prakriti} Mode)"
    else:
        mood_type = f"Restorative & Gentle 💫 ({prakriti} Mode)"
    
    return mood_type, unique_songs[:5], unique_genres[:4]

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'message': 'API is running'
    })

@app.route('/api/predict-mood', methods=['POST'])
def predict_mood():
    if model is None:
        return jsonify({'success': False, 'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        cycle_day = data.get('cycle_day', 14)
        user_date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        estrogen = data.get('estrogen', 50)
        prakriti = data.get('prakriti', 'Pitta')  # Get Prakriti from frontend
        
        phase_num = get_phase_from_day(cycle_day)
        lunar_sin, lunar_cos = calculate_lunar_phase(user_date)
        
        # Calculate moon phase name and illumination
        moon_phase = get_moon_phase_name(lunar_sin, lunar_cos)
        moon_illumination = get_moon_illumination(lunar_sin, lunar_cos)
        
        # Features must be in order: phase_num, lunar_sin, lunar_cos, estrogen
        features = np.array([[phase_num, lunar_sin, lunar_cos, estrogen]])
        features_scaled = scaler.transform(features)
        mood_score = model.predict(features_scaled)[0]
        
        # Get hybrid music recommendations with Prakriti
        mood_type, songs, genres = recommend_music_hybrid(mood_score, phase_num, prakriti)
        
        return jsonify({
            'success': True,
            'predicted_mood': round(float(mood_score), 1),
            'mood_type': mood_type,
            'cycle_phase': get_phase_name(phase_num),
            'day_in_cycle': cycle_day,
            'moon_phase': moon_phase,
            'moon_illumination': round(moon_illumination, 1),
            'recommended_songs': songs,
            'recommended_genres': genres,
            'prakriti_used': prakriti
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/cycle-info', methods=['GET'])
def cycle_info():
    return jsonify({
        'phases': [
            {'id': 1, 'name': 'Follicular', 'days': '6-14', 'description': 'Energy rising'},
            {'id': 2, 'name': 'Ovulation', 'days': '15-16', 'description': 'Peak energy'},
            {'id': 3, 'name': 'Luteal', 'days': '17-28', 'description': 'Slowing down'},
            {'id': 4, 'name': 'Menstrual', 'days': '1-5', 'description': 'Rest and reflect'}
        ]
    })

if __name__ == '__main__':
    print("=" * 50)
    print("📍 Server running at: http://localhost:5000")
    print("📊 Health check: http://localhost:5000/api/health")
    print("🔮 Predict: POST to http://localhost:5000/api/predict-mood")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)