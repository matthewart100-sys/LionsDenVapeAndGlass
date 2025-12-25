from flask import Flask, request, jsonify, session, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta
import sqlite3

# Get the parent directory (project root)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_FOLDER = os.path.join(PROJECT_ROOT, 'assets')
TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT)

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='/assets')

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
PRODUCTS_DB = 'products.db'

def init_db():
    """Initialize the database with users and products tables"""
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
    
    # Initialize products database
    if not os.path.exists(PRODUCTS_DB):
        conn = sqlite3.connect(PRODUCTS_DB)
        c = conn.cursor()
        c.execute('''CREATE TABLE products
                     (id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name TEXT NOT NULL,
                      category TEXT NOT NULL,
                      price REAL NOT NULL,
                      description TEXT,
                      image_url TEXT,
                      in_stock BOOLEAN DEFAULT 1,
                      rating REAL DEFAULT 0,
                      reviews INTEGER DEFAULT 0)''')
        
        # Add sample products
        products = [
            ('Premium Glass Bong', 'glass', 89.99, 'High-quality borosilicate glass bong with ice catcher', 'assets/images/bong.png', 1, 4.8, 45),
            ('Classic Vape Pen', 'vapes', 49.99, 'Sleek and portable vaporizer for dry herbs and concentrates', 'assets/images/bong.png', 1, 4.6, 32),
            ('Cleaning Solution Kit', 'accessories', 24.99, 'Premium cleaning solution for pipes and water bongs', 'assets/images/bong.png', 1, 4.9, 58),
            ('Silicone Grinder', 'accessories', 19.99, 'Non-stick silicone grinder for herbs', 'assets/images/bong.png', 1, 4.7, 41),
            ('Water Filtration Bong', 'glass', 129.99, 'Advanced water filtration system with percolator', 'assets/images/bong.png', 1, 4.9, 67),
            ('Portable Vaporizer', 'vapes', 199.99, 'High-end portable vaporizer with precision temperature control', 'assets/images/bong.png', 1, 4.8, 89),
            ('Glass Storage Jars', 'accessories', 34.99, 'Set of 3 airtight glass storage jars', 'assets/images/bong.png', 1, 4.6, 28),
            ('Rolling Machine', 'accessories', 12.99, 'Automatic rolling machine for perfect rolls', 'assets/images/bong.png', 1, 4.5, 19),
            ('Decorative Ashtrays', 'accessories', 29.99, 'Stylish glass ashtrays with designs', 'assets/images/bong.png', 1, 4.4, 15),
            ('Desktop Vaporizer', 'vapes', 299.99, 'Premium desktop vaporizer with digital controls', 'assets/images/bong.png', 1, 4.9, 112),
            ('Diffused Downstem', 'accessories', 22.99, 'Replacement diffused downstem for smooth hits', 'assets/images/bong.png', 1, 4.7, 36),
            ('Custom Bong Stand', 'accessories', 44.99, 'Protective stand for safe storage and display', 'assets/images/bong.png', 1, 4.8, 22),
            ('Concentrate Rig', 'glass', 159.99, 'Specialized rig for concentrate consumption', 'assets/images/bong.png', 1, 4.8, 54),
            ('Vape Cleaning Brush Set', 'accessories', 14.99, 'Professional brush set for vaporizer maintenance', 'assets/images/bong.png', 1, 4.6, 24),
            ('Mini Glass Bong', 'glass', 39.99, 'Compact portable glass bong for travel', 'assets/images/bong.png', 1, 4.5, 31),
        ]
        
        c.executemany('INSERT INTO products (name, category, price, description, image_url, in_stock, rating, reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', products)
        conn.commit()
        conn.close()
        print(f"Products database initialized with {len(products)} products")

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def get_products_db():
    """Get products database connection"""
    conn = sqlite3.connect(PRODUCTS_DB)
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

@app.route('/api/products/list', methods=['GET'])
def get_products_list():
    """Get all products as JSON"""
    try:
        conn = get_products_db()
        c = conn.cursor()
        c.execute('SELECT * FROM products')
        products = [dict(row) for row in c.fetchall()]
        conn.close()
        return jsonify({'success': True, 'products': products}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product as JSON"""
    try:
        conn = get_products_db()
        c = conn.cursor()
        c.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        product = c.fetchone()
        conn.close()
        
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        return jsonify({'success': True, 'product': dict(product)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/products/html/<int:product_id>', methods=['GET'])
def get_product_html(product_id):
    """Return customized HTML content for a product"""
    try:
        conn = get_products_db()
        c = conn.cursor()
        c.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        product = c.fetchone()
        conn.close()
        
        if not product:
            return '<div class="product-detail-error"><p>Product not found</p></div>', 404
        
        # Generate customized HTML
        html_content = f'''
        <div class="product-detail-container">
            <div class="product-detail-header">
                <h1>{product['name']}</h1>
                <span class="product-category">{product['category'].upper()}</span>
            </div>
            
            <div class="product-detail-body">
                <div class="product-detail-image">
                    <img src="{product['image_url']}" alt="{product['name']}" class="product-detail-img">
                </div>
                
                <div class="product-detail-info">
                    <div class="product-pricing">
                        <span class="product-price">${product['price']:.2f}</span>
                        {'<span class="in-stock">✓ In Stock</span>' if product['in_stock'] else '<span class="out-stock">Out of Stock</span>'}
                    </div>
                    
                    <div class="product-rating">
                        <span class="stars">{'⭐' * int(product['rating'])} {product['rating']}/5</span>
                        <span class="review-count">({product['reviews']} reviews)</span>
                    </div>
                    
                    <div class="product-description">
                        <h3>Description</h3>
                        <p>{product['description']}</p>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-cart" data-product-id="{product['id']}">
                            🛒 Add to Cart
                        </button>
                        <button class="btn-wishlist" data-product-id="{product['id']}">
                            ❤️ Add to Wishlist
                        </button>
                    </div>
                    
                    <div class="product-specs">
                        <h3>Product Details</h3>
                        <ul>
                            <li><strong>Category:</strong> {product['category']}</li>
                            <li><strong>Product ID:</strong> #{product['id']}</li>
                            <li><strong>Availability:</strong> {'In Stock' if product['in_stock'] else 'Out of Stock'}</li>
                            <li><strong>Customer Rating:</strong> {product['rating']}/5.0</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="product-detail-footer">
                <button class="btn-back-to-shop">← Back to Shop</button>
            </div>
        </div>
        '''
        
        return html_content, 200, {'Content-Type': 'text/html; charset=utf-8'}
    
    except Exception as e:
        return f'<div class="product-detail-error"><p>Error: {str(e)}</p></div>', 500


# ===== STATIC FILE SERVING =====
@app.route('/')
def index():
    """Serve the main index page"""
    return send_from_directory(TEMPLATE_FOLDER, 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files and HTML pages"""
    # Try to serve from assets folder first
    assets_path = os.path.join(STATIC_FOLDER, filename)
    if os.path.isfile(assets_path):
        return send_from_directory(STATIC_FOLDER, filename)
    
    # Try to serve from root directory
    root_file = os.path.join(TEMPLATE_FOLDER, filename)
    if os.path.isfile(root_file):
        return send_from_directory(TEMPLATE_FOLDER, filename)
    
    # Try to serve from pages folder
    pages_path = os.path.join(TEMPLATE_FOLDER, 'pages', filename)
    if os.path.isfile(pages_path):
        return send_from_directory(os.path.join(TEMPLATE_FOLDER, 'pages'), filename)
    
    # If not found, return 404
    return {'error': 'File not found'}, 404


@app.route('/pages/<path:filename>')
def serve_pages(filename):
    """Serve files from pages folder"""
    pages_folder = os.path.join(TEMPLATE_FOLDER, 'pages')
    return send_from_directory(pages_folder, filename)


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
