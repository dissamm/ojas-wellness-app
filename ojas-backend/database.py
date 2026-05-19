import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ojas.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            dosha_composition TEXT,
            dominant_dosha TEXT,
            menstrual_cycle_start TEXT,
            music_preferences TEXT
        )
    ''')
    conn.commit()
    conn.close()

def create_user(username, email, password, name):
    password_hash = generate_password_hash(password)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, name) VALUES (?, ?, ?, ?)',
            (username, email, password_hash, name)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return user_id
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return user

def update_user_profile(user_id, name=None, dosha_composition=None, dominant_dosha=None, menstrual_cycle_start=None, music_preferences=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    updates = []
    params = []
    
    if name is not None:
        updates.append("name = ?")
        params.append(name)
    if dosha_composition is not None:
        updates.append("dosha_composition = ?")
        params.append(dosha_composition)
    if dominant_dosha is not None:
        updates.append("dominant_dosha = ?")
        params.append(dominant_dosha)
    if menstrual_cycle_start is not None:
        updates.append("menstrual_cycle_start = ?")
        params.append(menstrual_cycle_start)
    if music_preferences is not None:
        updates.append("music_preferences = ?")
        params.append(music_preferences)
        
    if not updates:
        conn.close()
        return False
        
    params.append(user_id)
    query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
    
    cursor.execute(query, params)
    conn.commit()
    conn.close()
    return True
