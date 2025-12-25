# Production Deployment Guide - Lions Den Glass

## Overview
This guide covers setting up the Lions Den Glass website for production deployment using Gunicorn as the WSGI server.

## Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Development Server (Not for Production)
For local testing only:
```bash
python app.py
```

### 3. Production Deployment with Gunicorn

#### Option A: Basic Production Start (8 workers)
```bash
cd backend
gunicorn -c gunicorn_config.py wsgi:app
```

#### Option B: With Specific Worker Count
```bash
gunicorn --workers 4 --bind 0.0.0.0:5000 wsgi:app
```

#### Option C: Using Environment Variables
```bash
export BIND="0.0.0.0:5000"
export WORKERS=4
export LOG_LEVEL="info"
gunicorn -c gunicorn_config.py wsgi:app
```

### 4. Systemd Service Setup (Linux)
Create `/etc/systemd/system/lions-den-api.service`:

```ini
[Unit]
Description=Lions Den Glass API Server
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/LionsDenVapeAndGlass/backend
ExecStart=/usr/bin/gunicorn -c gunicorn_config.py wsgi:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable lions-den-api
sudo systemctl start lions-den-api
```

### 5. Nginx Reverse Proxy Configuration
Create `/etc/nginx/sites-available/lions-den`:

```nginx
upstream lions_den_api {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://lions_den_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /static {
        alias /path/to/LionsDenVapeAndGlass/assets;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/lions-den /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL/HTTPS with Let's Encrypt
```bash
sudo certbot --nginx -d your-domain.com
```

### 7. Environment Variables (Production)
Create `.env` file in backend directory:
```
SECRET_KEY=your-production-secret-key-here
SESSION_COOKIE_SECURE=True
DEBUG=False
BIND=0.0.0.0:5000
WORKERS=8
LOG_LEVEL=info
```

### 8. Database Backups
Regular backups of SQLite databases:
```bash
# Manual backup
cp backend/users.db backup/users.db.backup
cp backend/products.db backup/products.db.backup

# Automated daily backup (crontab)
0 2 * * * cp /path/to/backend/users.db /path/to/backup/users.db.$(date +\%Y\%m\%d)
0 2 * * * cp /path/to/backend/products.db /path/to/backup/products.db.$(date +\%Y\%m\%d)
```

## Performance Tuning

### Worker Count Calculation
- Formula: `(2 × CPU_cores) + 1`
- Example: 4 CPU cores = 9 workers
- Adjust based on memory and load testing

### Gunicorn Settings for Optimization
```bash
gunicorn \
  --workers 8 \
  --worker-class sync \
  --worker-connections 1000 \
  --max-requests 1000 \
  --max-requests-jitter 100 \
  --timeout 30 \
  --bind 0.0.0.0:5000 \
  wsgi:app
```

## Monitoring

### Check if service is running
```bash
sudo systemctl status lions-den-api
sudo netstat -tulnp | grep 5000
```

### View logs
```bash
# Gunicorn logs
sudo journalctl -u lions-den-api -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## CORS Configuration
Update `app.py` for production domains:
```python
CORS(app, supports_credentials=True, origins=[
    'https://your-domain.com',
    'https://www.your-domain.com'
])
```

## Security Checklist
- [ ] Change SECRET_KEY to a strong random value
- [ ] Set SESSION_COOKIE_SECURE=True
- [ ] Use HTTPS/SSL
- [ ] Restrict CORS origins
- [ ] Set DEBUG=False
- [ ] Regularly update dependencies
- [ ] Backup databases frequently
- [ ] Use strong database passwords if applicable
- [ ] Set up firewall rules
- [ ] Monitor server resources and logs

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

### Permission denied errors
```bash
sudo chown -R www-data:www-data /path/to/LionsDenVapeAndGlass
```

### High memory usage
Reduce worker count or adjust worker class to `gevent` (requires gevent package)

## Additional Resources
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Flask Production Deployment](https://flask.palletsprojects.com/deployment/)
- [Nginx Configuration](https://nginx.org/en/docs/)
