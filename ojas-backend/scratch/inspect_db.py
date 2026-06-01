import sqlite3

def inspect():
    conn = sqlite3.connect('ojas.db')
    cursor = conn.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print("Tables in database:", tables)
    
    for table in tables:
        if table.startswith('sqlite_'):
            continue
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"Table '{table}' has {count} rows.")
        
        # Print a few samples if any
        if count > 0:
            cursor.execute(f"PRAGMA table_info({table})")
            columns = [col[1] for col in cursor.fetchall()]
            print("Columns:", columns)
            cursor.execute(f"SELECT * FROM {table} LIMIT 5")
            rows = cursor.fetchall()
            print("Sample rows:")
            for r in rows:
                print(dict(zip(columns, r)))
                
    conn.close()

if __name__ == "__main__":
    inspect()
