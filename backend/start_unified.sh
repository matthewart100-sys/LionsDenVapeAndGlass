#!/bin/bash
# Unified production startup script for Lions Den Glass (Linux/Mac)
# Serves both API and static files from http://localhost:5000

cd "$(dirname "$0")"

# Set environment variables
export FLASK_ENV=production
export DEBUG=False
export SECRET_KEY=${SECRET_KEY:-$(openssl rand -base64 32)}

echo ""
echo "========================================"
echo "Lions Den Glass - PRODUCTION SERVER"
echo "========================================"
echo ""
echo "Frontend:  http://localhost:5000"
echo "API:       http://localhost:5000/api"
echo "Products:  http://localhost:5000/api/products/list"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

# Start Gunicorn with production settings
gunicorn -c gunicorn_config.py wsgi:app
