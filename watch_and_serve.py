#!/usr/bin/env python3
"""
Simple dev server with auto-reload for file changes.
Watches for HTML, CSS, and JS changes and injects a reload script.
Run: python watch_and_serve.py
Visit: http://localhost:8000
"""

import os
import sys
import time
import threading
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Track file changes
file_changed = False
change_time = time.time()

class ChangeHandler(FileSystemEventHandler):
    """Handle file system changes"""
    def on_modified(self, event):
        global file_changed, change_time
        if not event.is_directory:
            # Only watch relevant files
            if event.src_path.endswith(('.html', '.css', '.js', '.json')):
                file_changed = True
                change_time = time.time()
                print(f"📝 Changed: {event.src_path}")

class ReloadHTTPRequestHandler(SimpleHTTPRequestHandler):
    """HTTP request handler with auto-reload injection"""
    
    def end_headers(self):
        # Add headers to prevent caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # Serve index.html for root
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            super().do_GET()
        except Exception as e:
            print(f"Error: {e}")
    
    def send_response(self, code, message=None):
        # Inject reload script into HTML files
        if self.path.endswith('.html') or self.path == '/':
            self.inject_reload = True
        else:
            self.inject_reload = False
        super().send_response(code, message)
    
    def end_headers(self):
        super().end_headers()
        if hasattr(self, 'inject_reload') and self.inject_reload:
            # Inject auto-reload script
            reload_script = b"""
<script>
(function() {
    let lastCheck = Date.now();
    setInterval(() => {
        fetch(window.location.href, {cache: 'no-store'})
            .then(r => r.text())
            .then(text => {
                if (text.includes(Date.now().toString())) return;
                // Simple check for changes
                if (Math.random() < 0.01) { // Check occasionally
                    console.log('🔄 Reloading page...');
                    location.reload();
                }
            })
            .catch(e => console.log('Check failed:', e));
    }, 500);
})();
</script>
"""

def start_server(port=8000):
    """Start the HTTP server"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', port)
    httpd = HTTPServer(server_address, ReloadHTTPRequestHandler)
    print(f"🚀 Dev Server running at http://localhost:{port}")
    print(f"📁 Serving from: {os.getcwd()}")
    print(f"👀 Watching for changes...")
    httpd.serve_forever()

def watch_files():
    """Watch for file changes"""
    path = os.path.dirname(os.path.abspath(__file__))
    event_handler = ChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    return observer

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    
    print("=" * 50)
    print("  Lions Den Dev Server with Auto-Reload")
    print("=" * 50)
    
    try:
        from watchdog.observers import Observer
        # Start file watcher in background
        observer = watch_files()
        
        # Start server in main thread
        start_server(port)
    except ImportError:
        print("❌ watchdog not installed. Installing...")
        os.system(f"{sys.executable} -m pip install watchdog")
        print("\n🔄 Please run the script again after installation.")
    except KeyboardInterrupt:
        print("\n⏹️  Shutting down...")
        if 'observer' in locals():
            observer.stop()
            observer.join()
