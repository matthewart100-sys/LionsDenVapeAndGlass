# Lions Den Backend - Authentication Server

A Python Flask backend for user authentication with session management.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## Test Credentials

For testing without registration:
- **Email**: test@example.com
- **Password**: password123

## API Endpoints

### POST /api/auth/login
Authenticate user and create session.

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

### GET /api/auth/user
Get current logged-in user info (requires valid session).

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

### POST /api/auth/logout
Clear user session.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

## Configuration

Edit `app.py` to change:
- `SECRET_KEY`: Change the session secret in production
- `CORS origins`: Update allowed domains
- Database file location via `DATABASE` variable

## Database

SQLite database (`users.db`) is automatically created on first run with a test user pre-loaded.

## Notes

- Sessions expire after 7 days of inactivity
- Passwords are hashed using werkzeug security
- CORS is configured to work with GitHub Pages and local testing
- In production, set `SESSION_COOKIE_SECURE = True` when using HTTPS
