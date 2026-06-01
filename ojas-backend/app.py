from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import json
import os
import sys
from datetime import datetime, timedelta
import ephem
import jwt

# Reconfigure stdout/stderr to UTF-8 to avoid encoding errors on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')
from functools import wraps
from database import init_db, create_user, get_user_by_email, get_user_by_id, update_user_profile

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY", "ojas-cosmic-secret-key-108")

# Initialize database tables on load/import
init_db()

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

def get_estrogen_from_day(cycle_day):
    """Estimate estrogen level based on cycle day"""
    if cycle_day <= 7:
        return 35   # Menstrual - low estrogen
    elif cycle_day <= 14:
        return 65   # Follicular - rising estrogen
    elif cycle_day <= 16:
        return 95   # Ovulation - peak estrogen
    else:
        return 45   # Luteal - dropping estrogen

def get_phase_name(phase_num):
    phases = {1: 'Follicular', 2: 'Ovulation', 3: 'Luteal', 4: 'Menstrual'}
    return phases.get(phase_num, 'Unknown')

def get_mood_message(mood_score):
    """Convert numeric mood score to positive, empowering message"""
    if mood_score >= 7.5:
        return "🌟 Radiant", "You're radiating positive energy today!"
    elif mood_score >= 6.0:
        return "😊 Good", "You're in a good space. Keep flowing!"
    elif mood_score >= 4.5:
        return "🌿 Balanced", "A calm, steady day. Honor your rhythm."
    elif mood_score >= 3.0:
        return "💫 Gentle", "Be kind to yourself. Rest is productive."
    else:
        return "🌸 Nurturing", "Listen to your body. Softness is strength."

def recommend_music(mood_score, phase_num, prakriti='Pitta'):
    """Get music recommendations based on predicted mood"""
    if mood_score >= 7:
        mood_type = "Energetic"
        songs = [
            "Blinding Lights - The Weeknd",
            "Levitating - Dua Lipa",
            "Dance Monkey - Tones and I"
        ]
        genres = ["Pop", "Dance", "EDM"]
    elif mood_score >= 4:
        mood_type = "Calming"
        songs = [
            "Weightless - Marconi Union",
            "Here Comes the Sun - The Beatles",
            "Rises the Moon - Liana Flores"
        ]
        genres = ["Lofi", "Acoustic", "Ambient"]
    else:
        mood_type = "Relaxing"
        songs = [
            "Clair de Lune - Debussy",
            "River Flows in You - Yiruma",
            "Gymnopédie No.1 - Satie"
        ]
        genres = ["Classical", "Meditation", "Piano"]
    
    return mood_type, songs, genres

# ============================================
# API ENDPOINTS
# ============================================

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
        estrogen = data.get('estrogen', get_estrogen_from_day(cycle_day))
        prakriti = data.get('prakriti', 'Pitta')
        
        phase_num = get_phase_from_day(cycle_day)
        lunar_sin, lunar_cos = calculate_lunar_phase(user_date)
        
        moon_phase = get_moon_phase_name(lunar_sin, lunar_cos)
        moon_illumination = get_moon_illumination(lunar_sin, lunar_cos)
        
        features = np.array([[phase_num, lunar_sin, lunar_cos, estrogen]])
        features_scaled = scaler.transform(features)
        mood_score = model.predict(features_scaled)[0]
        
        mood_type, mood_message = get_mood_message(mood_score)
        music_mood_type, songs, genres = recommend_music(mood_score, phase_num, prakriti)
        
        return jsonify({
            'success': True,
            'predicted_mood': round(float(mood_score), 1),
            'mood_message': mood_message,
            'mood_type': mood_type,
            'music_mood_type': music_mood_type,
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

# ============================================
# NEW API ENDPOINTS FOR COMPLETE FLOW
# ============================================

@app.route('/api/assessment/calculate', methods=['POST'])
def calculate_prakriti():
    """Calculate dosha composition from assessment answers"""
    try:
        data = request.json
        answers = data.get('answers', {})
        
        counts = {'vata': 0, 'pitta': 0, 'kapha': 0}
        for answer in answers.values():
            if answer in counts:
                counts[answer] += 1
        
        total = sum(counts.values())
        
        if total == 0:
            composition = {'vata': 34, 'pitta': 33, 'kapha': 33}
        else:
            composition = {
                'vata': round((counts['vata'] / total) * 100),
                'pitta': round((counts['pitta'] / total) * 100),
                'kapha': round((counts['kapha'] / total) * 100),
            }
        
        dominant = max(composition, key=composition.get)
        
        return jsonify({
            'success': True,
            'composition': composition,
            'dominant': dominant.capitalize(),
            'message': f'Your dominant dosha is {dominant.capitalize()}'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/insights/daily', methods=['POST'])
def get_daily_insights():
    """Get daily affirmations and tips based on dosha"""
    try:
        data = request.json
        composition = data.get('composition', {})
        
        dominant = max(composition, key=composition.get) if composition else 'pitta'
        
        insights = {
            'vata': {
                'affirmation': 'I am grounded, calm, and centered in my body.',
                'tips': [
                    'Wake up at the same time every day',
                    'Eat warm, cooked meals',
                    'Practice gentle yoga or stretching',
                    'Take breaks throughout the day'
                ],
                'bestFoods': ['Warm soups', 'Cooked grains', 'Root vegetables', 'Ginger tea'],
                'avoidFoods': ['Cold drinks', 'Raw vegetables', 'Caffeine', 'Dry snacks']
            },
            'pitta': {
                'affirmation': 'I am cool, calm, and balanced within.',
                'tips': [
                    'Avoid overheating during exercise',
                    'Take breaks and rest midday',
                    'Practice cooling breathing exercises',
                    'Spend time in nature near water'
                ],
                'bestFoods': ['Coconut water', 'Sweet fruits', 'Cucumber', 'Fresh salads'],
                'avoidFoods': ['Spicy food', 'Coffee', 'Fried food', 'Sour fruits']
            },
            'kapha': {
                'affirmation': 'I am energetic, light, and motivated to move.',
                'tips': [
                    'Exercise daily, especially in the morning',
                    'Wake up early, avoid sleeping in',
                    'Try new activities and challenges',
                    'Keep a consistent routine'
                ],
                'bestFoods': ['Light fruits', 'Spices like ginger', 'Warm water with honey', 'Leafy greens'],
                'avoidFoods': ['Dairy', 'Fried food', 'Sugar', 'Heavy desserts']
            }
        }
        
        result = insights.get(dominant, insights['pitta'])
        
        current_hour = datetime.now().hour
        if current_hour < 12:
            result['affirmation'] = f"Good morning! {result['affirmation']}"
        elif current_hour < 18:
            result['affirmation'] = f"Good afternoon. {result['affirmation']}"
        else:
            result['affirmation'] = f"Good evening. {result['affirmation']}"
        
        return jsonify({
            'success': True,
            'affirmation': result['affirmation'],
            'tips': result['tips'],
            'bestFoods': result['bestFoods'],
            'avoidFoods': result['avoidFoods']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/music/recommendations', methods=['POST'])
def get_music_recommendations():
    """Get personalized music recommendations"""
    try:
        data = request.json
        composition = data.get('composition', {})
        
        dominant = max(composition, key=composition.get) if composition else 'pitta'
        
        recommendations = {
            'vata': {
                'playlists': [
                    {'name': 'Grounding Rhythms', 'description': 'Earthy beats to anchor your energy', 'icon': '🌍', 'tracks': 20},
                    {'name': 'Calm & Centered', 'description': 'Gentle melodies for relaxation', 'icon': '🎵', 'tracks': 18},
                    {'name': 'Ambient Flow', 'description': 'Space for peaceful thoughts', 'icon': '🌊', 'tracks': 22}
                ],
                'genres': ['Ambient', 'Acoustic', 'Folk', 'Classical']
            },
            'pitta': {
                'playlists': [
                    {'name': 'Cooling Serenity', 'description': 'Soothing sounds to balance', 'icon': '❄️', 'tracks': 25},
                    {'name': 'Water Elements', 'description': 'Flowing melodies', 'icon': '💧', 'tracks': 20},
                    {'name': 'Peaceful Piano', 'description': 'Gentle instrumental music', 'icon': '🎹', 'tracks': 28}
                ],
                'genres': ['Classical', 'Jazz', 'Instrumental', 'Lofi']
            },
            'kapha': {
                'playlists': [
                    {'name': 'Uplifting Energy', 'description': 'Stimulating rhythms', 'icon': '⚡', 'tracks': 22},
                    {'name': 'Morning Motivation', 'description': 'Wake up with these beats', 'icon': '🌅', 'tracks': 18},
                    {'name': 'Active Flow', 'description': 'Keep your energy moving', 'icon': '🏃', 'tracks': 24}
                ],
                'genres': ['World', 'Dance', 'Electronic', 'Upbeat Pop']
            }
        }
        
        result = recommendations.get(dominant, recommendations['pitta'])
        
        return jsonify({
            'success': True,
            'dominant_dosha': dominant.capitalize(),
            'playlists': result['playlists'],
            'recommended_genres': result['genres']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ============================================
# AUTHENTICATION & SECURITY
# ============================================

def generate_token(user_id):
    payload = {
        'sub': str(user_id),
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')

def decode_token(token):
    try:
        payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return int(payload['sub'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'success': False, 'message': 'Token is missing'}), 401
        
        user_id = decode_token(token)
        if not user_id:
            return jsonify({'success': False, 'message': 'Token is invalid or expired'}), 401
            
        current_user = get_user_by_id(user_id)
        if not current_user:
            return jsonify({'success': False, 'message': 'User not found'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

def serialize_user(user):
    return {
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'name': user['name'],
        'doshaComposition': json.loads(user['dosha_composition']) if user['dosha_composition'] else None,
        'dominantDosha': user['dominant_dosha'],
        'menstrualCycleStart': user['menstrual_cycle_start'],
        'musicPreferences': json.loads(user['music_preferences']) if user['music_preferences'] else None,
        'gender': user['gender'] if ('gender' in user.keys() and user['gender'] is not None) else 'female',
        'profilePicture': user['profile_picture'] if ('profile_picture' in user.keys() and user['profile_picture'] is not None) else None,
        'dateOfBirth': user['date_of_birth'] if ('date_of_birth' in user.keys() and user['date_of_birth'] is not None) else None
    }

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        gender = data.get('gender', 'female')
        date_of_birth = data.get('dateOfBirth')
        
        print(f"[REGISTER DEBUG] Attempting signup for email: {email}, username: {username}")
        
        if not username or not email or not password:
            print("[REGISTER DEBUG] Missing required fields")
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
            
        user_id = create_user(username, email, password, name, gender, date_of_birth)
        print(f"[REGISTER DEBUG] Database result user_id: {user_id}")
        
        if not user_id:
            print("[REGISTER DEBUG] Email or username already exists or database insert failed")
            return jsonify({'success': False, 'message': 'Username or Email already exists'}), 409
            
        token = generate_token(user_id)
        user = get_user_by_id(user_id)
        
        print(f"[REGISTER DEBUG] Signup successful. Generated token length: {len(token) if token else 0}")
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'token': token,
            'user': serialize_user(user)
        }), 201
    except Exception as e:
        print(f"[REGISTER DEBUG] Exception raised: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        print(f"[LOGIN DEBUG] Login attempt started for: {email}")
        
        if not email or not password:
            print("[LOGIN DEBUG] Email or password not provided in request")
            return jsonify({'success': False, 'message': 'Email and Password are required'}), 400
            
        from werkzeug.security import check_password_hash
        user = get_user_by_email(email)
        if not user:
            print(f"[LOGIN DEBUG] No user found for email: {email}")
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
            
        print(f"[LOGIN DEBUG] Found user id: {user['id']}, email: {user['email']}")
        print(f"[LOGIN DEBUG] Verifying password hash: {user['password_hash']}")
        
        pw_match = check_password_hash(user['password_hash'], password)
        print(f"[LOGIN DEBUG] Password verification result: {pw_match}")
        
        if not pw_match:
            print("[LOGIN DEBUG] Password verification failed")
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
            
        token = generate_token(user['id'])
        print(f"[LOGIN DEBUG] Login success for user {user['id']}. Generated token.")
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': serialize_user(user)
        })
    except Exception as e:
        print(f"[LOGIN DEBUG] Exception raised: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify({
        'success': True,
        'user': serialize_user(current_user)
    })

@app.route('/api/auth/update-profile', methods=['POST'])
@token_required
def update_profile(current_user):
    try:
        data = request.json
        name = data.get('name')
        dosha_composition = data.get('doshaComposition')
        dominant_dosha = data.get('dominantDosha')
        menstrual_cycle_start = data.get('menstrualCycleStart')
        music_preferences = data.get('musicPreferences')
        gender = data.get('gender')
        profile_picture = data.get('profilePicture')
        date_of_birth = data.get('dateOfBirth')
        
        # Serialize JSON fields if present
        dosha_comp_str = json.dumps(dosha_composition) if dosha_composition is not None else None
        music_pref_str = json.dumps(music_preferences) if music_preferences is not None else None
        
        success = update_user_profile(
            current_user['id'],
            name=name,
            dosha_composition=dosha_comp_str,
            dominant_dosha=dominant_dosha,
            menstrual_cycle_start=menstrual_cycle_start,
            music_preferences=music_pref_str,
            gender=gender,
            profile_picture=profile_picture,
            date_of_birth=date_of_birth
        )
        
        if not success:
            # We still return success as user might send identical values during auto-sync
            pass
            
        updated_user = get_user_by_id(current_user['id'])
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': serialize_user(updated_user)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/change-email', methods=['POST'])
@token_required
def change_email(current_user):
    try:
        data = request.json
        new_email = data.get('newEmail')
        password = data.get('password')
        
        if not new_email or not password:
            return jsonify({'success': False, 'message': 'New email and password are required'}), 400
            
        from werkzeug.security import check_password_hash
        # Verify password
        if not check_password_hash(current_user['password_hash'], password):
            return jsonify({'success': False, 'message': 'Incorrect password'}), 401
            
        # Import helpers from database
        from database import change_user_email, get_user_by_id
        success = change_user_email(current_user['id'], new_email)
        if not success:
            return jsonify({'success': False, 'message': 'Email already in use'}), 409
            
        updated_user = get_user_by_id(current_user['id'])
        return jsonify({
            'success': True,
            'message': 'Email updated successfully',
            'user': serialize_user(updated_user)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    try:
        data = request.json
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        if not current_password or not new_password:
            return jsonify({'success': False, 'message': 'Current and new passwords are required'}), 400
            
        from werkzeug.security import check_password_hash
        # Verify current password
        if not check_password_hash(current_user['password_hash'], current_password):
            return jsonify({'success': False, 'message': 'Incorrect current password'}), 401
            
        # Update password
        from database import change_user_password, get_user_by_id
        success = change_user_password(current_user['id'], new_password)
        if not success:
            return jsonify({'success': False, 'message': 'Failed to update password'}), 500
            
        updated_user = get_user_by_id(current_user['id'])
        return jsonify({
            'success': True,
            'message': 'Password updated successfully',
            'user': serialize_user(updated_user)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/auth/delete-account', methods=['POST'])
@token_required
def delete_account(current_user):
    try:
        from database import delete_user
        success = delete_user(current_user['id'])
        if not success:
            return jsonify({'success': False, 'message': 'Failed to delete account'}), 500
            
        return jsonify({
            'success': True,
            'message': 'Account deleted successfully'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


if __name__ == '__main__':
    print("=" * 50)
    print("📍 Server running...")
    print("=" * 50)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)