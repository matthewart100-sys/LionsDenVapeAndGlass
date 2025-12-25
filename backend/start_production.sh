#!/bin/bash
# Production startup script for Lions Den Glass API

cd "$(dirname "$0")"

# Set environment variables
export FLASK_ENV=production
export DEBUG=False
export SECRET_KEY=${SECRET_KEY:-$(openssl rand -base64 32)}

# Install dependencies if needed
if [ ! -d "venv" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start Gunicorn with production settings
gunicorn -c gunicorn_config.py wsgi:app
