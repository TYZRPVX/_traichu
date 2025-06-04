#!/bin/bash
# _traichu macOS/Linux Deployment Script
# This script starts a local server to serve the _traichu static site

set -e  # Exit on any error

# Default values
DEFAULT_PORT=8080
DEFAULT_HOST="localhost"

# Parse arguments
PORT=${1:-$DEFAULT_PORT}
HOST=${2:-$DEFAULT_HOST}

echo ""
echo "========================================"
echo "   _traichu macOS/Linux Deployment Server"
echo "========================================"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Python is installed
if ! command_exists python3; then
    echo "❌ Error: Python 3 is not installed"
    echo "   Please install Python 3:"
    echo "   - macOS: brew install python3 or download from https://python.org"
    echo "   - Linux: sudo apt install python3 (Ubuntu/Debian) or equivalent"
    exit 1
fi

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to project directory
cd "$PROJECT_DIR"

# Check if index.html exists
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    echo "   Current directory: $(pwd)"
    echo "   Make sure you're running this script from the _traichu root directory."
    echo "   Or run: cd .. && ./deploy/deploy.sh"
    exit 1
fi

echo "🚀 Starting _traichu deployment server..."
echo "📁 Directory: $(pwd)"
echo "💻 Platform: $(uname -s) $(uname -r)"
echo "🔧 Press Ctrl+C to stop the server"
echo ""

# Try to run the Python deployment script first
if [ -f "deploy/deploy.py" ]; then
    python3 deploy/deploy.py "$PORT" "$HOST"
else
    # Fallback to simple HTTP server
    echo "📍 Serving at: http://$HOST:$PORT"
    echo "🌐 Open http://$HOST:$PORT in your browser"
    echo ""
    
    # Try to open browser automatically on macOS (only for localhost)
    if [[ "$OSTYPE" == "darwin"* ]] && [[ "$HOST" == "localhost" || "$HOST" == "127.0.0.1" ]]; then
        sleep 2 && open "http://$HOST:$PORT" &
    fi
    
    python3 -m http.server "$PORT" --bind "$HOST"
fi 