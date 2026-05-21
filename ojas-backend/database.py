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
            music_preferences TEXT,
            gender TEXT
        )
    ''')
    try:
        cursor.execute("SELECT gender FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN gender TEXT")
    try:
        cursor.execute("SELECT profile_picture FROM users LIMIT 1")
    except sqlite3.OperationalError:
        cursor.execute("ALTER TABLE users ADD COLUMN profile_picture TEXT")
    conn.commit()
    conn.close()

def create_user(username, email, password, name, gender=None):
    email = email.lower().strip()
    password_hash = generate_password_hash(password)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO users (username, email, password_hash, name, gender) VALUES (?, ?, ?, ?, ?)',
            (username, email, password_hash, name, gender)
        )
        conn.commit()
        user_id = cursor.lastrowid
        return user_id
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_email(email):
    email = email.lower().strip()
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', (email,)).fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    return user

def update_user_profile(user_id, name=None, dosha_composition=None, dominant_dosha=None, menstrual_cycle_start=None, music_preferences=None, gender=None, profile_picture=None):
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
    if gender is not None:
        updates.append("gender = ?")
        params.append(gender)
    if profile_picture is not None:
        updates.append("profile_picture = ?")
        params.append(profile_picture)
        
    if not updates:
        conn.close()
        return False
        
    params.append(user_id)
    query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
    
    cursor.execute(query, params)
    conn.commit()
    conn.close()
    return True

def change_user_email(user_id, new_email):
    new_email = new_email.lower().strip()
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if email is already taken by someone else
        existing = cursor.execute('SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND id != ?', (new_email, user_id)).fetchone()
        if existing:
            return False
        cursor.execute('UPDATE users SET email = ? WHERE id = ?', (new_email, user_id))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def change_user_password(user_id, new_password):
    password_hash = generate_password_hash(new_password)
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('UPDATE users SET password_hash = ? WHERE id = ?', (password_hash, user_id))
        conn.commit()
        return True
    except Exception:
        return False
    finally:
        conn.close()

def delete_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        conn.commit()
        return True
    except Exception:
        return False
    finally:
        conn.close()
