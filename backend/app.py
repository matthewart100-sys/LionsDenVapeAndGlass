from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta
import sqlite3

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Enable CORS with credentials
CORS(app, supports_credentials=True, origins=['http://localhost:*', 'https://matthewart100-sys.github.io'])

# Database initialization
DATABASE = 'users.db'

def init_db():
    """Initialize the database with users table"""
    if not os.path.exists(DATABASE):
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('''CREATE TABLE users
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      email TEXT UNIQUE NOT NULL,
                      password_hash TEXT NOT NULL,
                      first_name TEXT,
                      last_name TEXT,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        # Add sample test user (email: test@example.com, password: password123)
        test_email = 'test@example.com'
        test_password = generate_password_hash('password123')
        c.execute('INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
                  (test_email, test_password, 'Test', 'User'))
        
        conn.commit()
        conn.close()
        print(f"Database initialized. Test user: {test_email} / password123")

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_user_by_email(email):
    """Fetch user by email from database"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    """Fetch user by ID from database"""
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = c.fetchone()
    conn.close()
    return user

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user and create session"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'error': 'Email and password required'}), 400
    
    email = data['email'].strip().lower()
    password = data['password']
    
    # Find user
    user = get_user_by_email(email)
    
    if not user:
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
    
    # Verify password
    if not check_password_hash(user['password_hash'], password):
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
    
    # Create session
    session.permanent = True
    session['user_id'] = user['id']
    session['email'] = user['email']
    session['first_name'] = user['first_name']
    session['last_name'] = user['last_name']
    
    return jsonify({
        'success': True,
        'message': 'Login successful',
        'user': {
            'id': user['id'],
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name']
        }
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Clear user session"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logout successful'}), 200

@app.route('/api/auth/user', methods=['GET'])
def get_user():
    """Get current logged-in user info from session"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'error': 'Not authenticated'}), 401
    
    user = get_user_by_id(session['user_id'])
    
    if not user:
        session.clear()
        return jsonify({'success': False, 'error': 'User not found'}), 404
    
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'first_name': user['first_name'],
            'last_name': user['last_name']
        }
    }), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'success': False, 'error': 'Email and password required'}), 400
    
    if not data.get('first_name') or not data.get('last_name'):
        return jsonify({'success': False, 'error': 'First name and last name required'}), 400
    
    email = data['email'].strip().lower()
    password = data['password']
    first_name = data['first_name'].strip()
    last_name = data['last_name'].strip()
    
    # Check if user already exists
    if get_user_by_email(email):
        return jsonify({'success': False, 'error': 'Email already registered'}), 409
    
    # Hash password
    password_hash = generate_password_hash(password)
    
    # Save to database
    conn = get_db()
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)',
                  (email, password_hash, first_name, last_name))
        conn.commit()
        user_id = c.lastrowid
    except sqlite3.Error as e:
        conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500
    
    conn.close()
    
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'user': {
            'id': user_id,
            'email': email,
            'first_name': first_name,
            'last_name': last_name
        }
    }), 201

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
