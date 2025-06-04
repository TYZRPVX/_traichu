#!/usr/bin/env python3
"""
_traichu Local Deployment Server
A cross-platform Python server for serving the _traichu static site locally.
Works on macOS, Windows, and Linux.

Usage:
    python3 deploy.py [port] [host]
    
Examples:
    python3 deploy.py           # Default: localhost:8080 (no browser)
    python3 deploy.py 3000      # Custom port: localhost:3000 (no browser)
    python3 deploy.py 3000 0.0.0.0  # Network access: 0.0.0.0:3000 (no browser)
    python3 deploy.py --browser # Open browser automatically
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import signal
import platform
import argparse
from pathlib import Path

# Default configuration
DEFAULT_PORT = 8080
DEFAULT_HOST = 'localhost'

class TraichuHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with better error handling and logging."""
    
    def end_headers(self):
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Override to provide cleaner logging."""
        print(f"[{self.log_date_time_string()}] {format % args}")

def find_available_port(start_port=DEFAULT_PORT, host=DEFAULT_HOST, max_attempts=10):
    """Find an available port starting from the given port."""
    import socket
    
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((host, port))
                return port
        except OSError:
            continue
    
    raise RuntimeError(f"Could not find an available port in range {start_port}-{start_port + max_attempts}")

def signal_handler(signum, frame):
    """Handle Ctrl+C gracefully."""
    print("\n\n🛑 Shutting down _traichu server...")
    sys.exit(0)

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='_traichu Local Deployment Server',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 deploy.py              # Default: localhost:8080 (no browser)
  python3 deploy.py 3000         # Custom port: localhost:3000 (no browser)
  python3 deploy.py 3000 0.0.0.0 # Network access: 0.0.0.0:3000 (no browser)
  python3 deploy.py --browser    # Open browser automatically
        """
    )
    
    parser.add_argument(
        'port', 
        nargs='?', 
        type=int, 
        default=DEFAULT_PORT,
        help=f'Port to serve on (default: {DEFAULT_PORT})'
    )
    
    parser.add_argument(
        'host', 
        nargs='?', 
        default=DEFAULT_HOST,
        help=f'Host to bind to (default: {DEFAULT_HOST})'
    )
    
    parser.add_argument(
        '--browser', 
        action='store_true',
        help='Open browser automatically'
    )
    
    return parser.parse_args()

def main():
    """Main deployment function."""
    # Parse command line arguments
    args = parse_arguments()
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Change to the parent directory (where index.html should be)
    script_dir = Path(__file__).parent.absolute()
    project_dir = script_dir.parent
    os.chdir(project_dir)
    
    # Check if index.html exists
    if not Path('index.html').exists():
        print("❌ Error: index.html not found!")
        print(f"   Current directory: {project_dir}")
        print("   Make sure you're running this script from the _traichu root directory.")
        print("   Or run: cd .. && python3 deploy/deploy.py")
        sys.exit(1)
    
    # Find available port
    try:
        port = find_available_port(args.port, args.host)
        if port != args.port:
            print(f"⚠️  Port {args.port} is busy, using port {port} instead")
    except RuntimeError as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    
    # Create server
    try:
        with socketserver.TCPServer((args.host, port), TraichuHTTPRequestHandler) as httpd:
            server_url = f"http://{args.host}:{port}"
            
            print("🚀 _traichu deployment server starting...")
            print(f"📍 Serving at: {server_url}")
            print(f"📁 Directory: {project_dir}")
            print(f"💻 Platform: {platform.system()} {platform.release()}")
            print("🔧 Press Ctrl+C to stop the server")
            print("-" * 50)
            
            # Open browser only if explicitly requested
            if args.browser and args.host in ['localhost', '127.0.0.1']:
                try:
                    webbrowser.open(server_url)
                    print(f"🌐 Opening {server_url} in your default browser...")
                except Exception as e:
                    print(f"⚠️  Could not open browser automatically: {e}")
                    print(f"   Please manually open: {server_url}")
            else:
                print(f"🌐 Open {server_url} in your browser")
            
            print("-" * 50)
            
            # Start serving
            httpd.serve_forever()
            
    except PermissionError:
        print(f"❌ Error: Permission denied to bind to port {port}")
        print("   Try running with administrator/sudo privileges or use a different port.")
        sys.exit(1)
    except OSError as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 