# Authentication Setup & Usage Guide

## Backend Setup (Python Flask)

### 1. Install Dependencies
Open a terminal in the `backend/` directory and run:
```bash
pip install -r requirements.txt
```

### 2. Start the Server
From the `backend/` directory:
```bash
python app.py
```

You should see:
```
Database initialized. Test user: test@example.com / password123
 * Running on http://localhost:5000
```

**The server must be running for the sign-in card to work!**

## Testing the Authentication

### Test User Credentials
- **Email**: test@example.com
- **Password**: password123

### How It Works

1. **User enters email & password** in the sign-in card
2. **Frontend (auth.js)** sends credentials to backend
3. **Backend validates** credentials against database
4. **On success**: 
   - Session is created on server
   - User info stored in browser localStorage
   - Success message displayed
   - Sign-in card closes
5. **User info persists** in localStorage until logout

## API Endpoints

All endpoints are at `http://localhost:5000`

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

Response (200):
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

### Get Current User
```
GET /api/auth/user

Response (200):
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

### Register New User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe"
}

Response (201):
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

### Logout
```
POST /api/auth/logout

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

## Frontend Features

### auth.js Script
Handles:
- Form submission and API calls
- Error/success notifications
- localStorage user storage
- Remember me functionality
- Session persistence

### User Data Storage
User info is stored in `localStorage['currentUser']`:
```javascript
{
  "id": 1,
  "email": "test@example.com",
  "first_name": "Test",
  "last_name": "User"
}
```

Access it anywhere:
```javascript
const user = window.authManager.getUser();
console.log(user.first_name); // "Test"
```

### Clear User Session (Logout)
```javascript
window.authManager.clearUser();
```

## Production Deployment

### For GitHub Pages + Backend

1. **Keep local backend running** for testing
2. **Deploy backend separately** to a server (Heroku, DigitalOcean, AWS, etc.)
3. **Update API_BASE in auth.js** to point to your deployed backend:
   ```javascript
   const API_BASE = 'https://your-backend-url.com';
   ```

### Security Considerations

Before deploying:
- [ ] Change `SECRET_KEY` in `app.py` to a random secure string
- [ ] Set `SESSION_COOKIE_SECURE = True` (requires HTTPS)
- [ ] Set `SESSION_COOKIE_SAMESITE = 'Strict'`
- [ ] Use environment variables for sensitive config
- [ ] Set proper CORS origins instead of wildcards
- [ ] Use HTTPS for all connections
- [ ] Hash all passwords (already done with werkzeug)
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Use a production WSGI server (gunicorn, waitress) instead of Flask dev server

## Troubleshooting

### "Network error. Make sure the backend server is running..."
- Backend server not started
- Fix: Run `python app.py` in the backend directory

### "Invalid email or password"
- Wrong credentials
- Fix: Use test@example.com / password123 or register a new user

### CORS Error
- Frontend and backend not on expected URLs
- Fix: Check CORS configuration in `app.py`

### Database locked error
- Multiple instances trying to access database
- Fix: Make sure only one backend server is running

## File Structure

```
backend/
├── app.py              # Flask server & API endpoints
├── requirements.txt    # Python dependencies
├── README.md          # Backend documentation
└── users.db           # SQLite database (created on first run)

frontend/
└── assets/js/auth.js  # Frontend authentication handler
```

## Next Steps

- Add "Sign Up" form submission to call `/api/auth/register`
- Create user profile page to display logged-in user info
- Add logout button that calls `/api/auth/logout`
- Implement password reset functionality
- Add email verification for new accounts
- Deploy backend to production hosting
