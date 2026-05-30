import sqlite3

def clear_users():
    conn = sqlite3.connect('ojas.db')
    cursor = conn.cursor()
    
    try:
        # Check current count
        cursor.execute("SELECT COUNT(*) FROM users")
        before_count = cursor.fetchone()[0]
        print(f"Users in database before clearing: {before_count}")
        
        # Delete all users
        cursor.execute("DELETE FROM users")
        
        # Reset the autoincrement sequence if desired
        cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")
        
        conn.commit()
        
        # Check count after clearing
        cursor.execute("SELECT COUNT(*) FROM users")
        after_count = cursor.fetchone()[0]
        print(f"Users in database after clearing: {after_count}")
        print("Successfully cleared all registered users/emails.")
    except Exception as e:
        print(f"Error occurred: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    clear_users()
