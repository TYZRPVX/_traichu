#!/bin/bash
# _traichu Auto-Start Script
# This script silently starts the _traichu server in the background
# Add this to your .zshrc to auto-start on terminal launch

# Configuration
TRAICHU_DIR="/Users/x/Projects/Github/_traichu"  # Update this path to your project
TRAICHU_PORT=8080
TRAICHU_HOST="localhost"
PIDFILE="$TRAICHU_DIR/.traichu.pid"

# Function to check if server is already running
is_server_running() {
    if [ -f "$PIDFILE" ]; then
        local pid=$(cat "$PIDFILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0  # Server is running
        else
            rm -f "$PIDFILE"  # Clean up stale PID file
            return 1  # Server not running
        fi
    fi
    return 1  # No PID file, server not running
}

# Function to start server silently
start_traichu_server() {
    if is_server_running; then
        return 0  # Already running, do nothing
    fi
    
    # Check if project directory exists
    if [ ! -d "$TRAICHU_DIR" ]; then
        return 1  # Project directory not found
    fi
    
    # Check if index.html exists
    if [ ! -f "$TRAICHU_DIR/index.html" ]; then
        return 1  # Project files not found
    fi
    
    # Start server in background
    cd "$TRAICHU_DIR"
    nohup python3 deploy/deploy.py "$TRAICHU_PORT" "$TRAICHU_HOST" > /dev/null 2>&1 &
    local server_pid=$!
    
    # Save PID for later management
    echo "$server_pid" > "$PIDFILE"
    
    # Optional: uncomment the line below if you want a silent notification
    # echo "🚀 _traichu server started silently at http://$TRAICHU_HOST:$TRAICHU_PORT (PID: $server_pid)"
}

# Function to stop server (for manual use)
stop_traichu_server() {
    if [ -f "$PIDFILE" ]; then
        local pid=$(cat "$PIDFILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            kill "$pid"
            rm -f "$PIDFILE"
            echo "🛑 _traichu server stopped"
        else
            rm -f "$PIDFILE"
            echo "⚠️  Server was not running"
        fi
    else
        echo "⚠️  No server PID file found"
    fi
}

# Function to check server status
traichu_status() {
    if is_server_running; then
        local pid=$(cat "$PIDFILE")
        echo "✅ _traichu server is running at http://$TRAICHU_HOST:$TRAICHU_PORT (PID: $pid)"
        return 0
    else
        echo "❌ _traichu server is not running"
        return 1
    fi
}

# Main execution - only start if called directly or sourced
case "$1" in
    "stop")
        stop_traichu_server
        ;;
    "status")
        traichu_status
        ;;
    "restart")
        stop_traichu_server
        sleep 1
        start_traichu_server
        traichu_status
        ;;
    "start"|"")
        start_traichu_server
        ;;
esac 