"""
Gunicorn configuration for production deployment
"""
import os
import multiprocessing

# Server socket
bind = os.environ.get('BIND', '0.0.0.0:5000')
backlog = 2048

# Worker processes (Render free tier: 512MB RAM = 2 workers max)
workers = int(os.environ.get('WORKERS', min(2, max(1, multiprocessing.cpu_count() - 1))))
worker_class = 'sync'
worker_connections = 100
timeout = 30
keepalive = 2

# Logging
accesslog = os.environ.get('ACCESS_LOG', '-')
errorlog = os.environ.get('ERROR_LOG', '-')
loglevel = os.environ.get('LOG_LEVEL', 'info')

# Process naming
proc_name = 'lions-den-api'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL
keyfile = os.environ.get('SSL_KEY', None)
certfile = os.environ.get('SSL_CERT', None)

# Application
forwarded_allow_ips = '*'
secure_scheme_headers = {
    'X-FORWARDED_PROTOCOL': 'ssl',
    'X-FORWARDED_PROTO': 'https',
    'X-FORWARDED_SSL': 'on',
}
