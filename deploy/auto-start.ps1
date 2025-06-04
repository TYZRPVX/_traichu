# _traichu Auto-Start PowerShell Script
# This script silently starts the _traichu server in the background
# Add this to your PowerShell profile to auto-start on terminal launch

# Configuration
$TRAICHU_DIR = "C:\Users\x\Projects\Github\_traichu"  # Update this path to your project
$TRAICHU_PORT = 8080
$TRAICHU_HOST = "localhost"
$PIDFILE = Join-Path $TRAICHU_DIR ".traichu.pid"

# Function to check if server is already running
function Test-TraichuServerRunning {
    if (Test-Path $PIDFILE) {
        $pid = Get-Content $PIDFILE -ErrorAction SilentlyContinue
        if ($pid -and (Get-Process -Id $pid -ErrorAction SilentlyContinue)) {
            return $true  # Server is running
        } else {
            Remove-Item $PIDFILE -Force -ErrorAction SilentlyContinue  # Clean up stale PID file
            return $false  # Server not running
        }
    }
    return $false  # No PID file, server not running
}

# Function to start server silently
function Start-TraichuServer {
    if (Test-TraichuServerRunning) {
        return  # Already running, do nothing
    }
    
    # Check if project directory exists
    if (-not (Test-Path $TRAICHU_DIR)) {
        return  # Project directory not found
    }
    
    # Check if index.html exists
    if (-not (Test-Path (Join-Path $TRAICHU_DIR "index.html"))) {
        return  # Project files not found
    }
    
    # Start server in background
    Push-Location $TRAICHU_DIR
    try {
        $process = Start-Process -FilePath "python" -ArgumentList "deploy\deploy.py", $TRAICHU_PORT, $TRAICHU_HOST -WindowStyle Hidden -PassThru
        
        # Save PID for later management
        $process.Id | Out-File -FilePath $PIDFILE -Encoding ASCII
        
        # Optional: uncomment the line below if you want a silent notification
        # Write-Host "🚀 _traichu server started silently at http://$TRAICHU_HOST`:$TRAICHU_PORT (PID: $($process.Id))"
    }
    catch {
        # Silently fail if there's an error
    }
    finally {
        Pop-Location
    }
}

# Function to stop server (for manual use)
function Stop-TraichuServer {
    if (Test-Path $PIDFILE) {
        $pid = Get-Content $PIDFILE -ErrorAction SilentlyContinue
        if ($pid) {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Stop-Process -Id $pid -Force
                Remove-Item $PIDFILE -Force -ErrorAction SilentlyContinue
                Write-Host "🛑 _traichu server stopped"
            } else {
                Remove-Item $PIDFILE -Force -ErrorAction SilentlyContinue
                Write-Host "⚠️  Server was not running"
            }
        }
    } else {
        Write-Host "⚠️  No server PID file found"
    }
}

# Function to check server status
function Get-TraichuStatus {
    if (Test-TraichuServerRunning) {
        $pid = Get-Content $PIDFILE
        Write-Host "✅ _traichu server is running at http://$TRAICHU_HOST`:$TRAICHU_PORT (PID: $pid)"
        return $true
    } else {
        Write-Host "❌ _traichu server is not running"
        return $false
    }
}

# Function to restart server
function Restart-TraichuServer {
    Stop-TraichuServer
    Start-Sleep -Seconds 1
    Start-TraichuServer
    Get-TraichuStatus
}

# Main execution based on parameters
param(
    [string]$Action = "start"
)

switch ($Action.ToLower()) {
    "stop" {
        Stop-TraichuServer
    }
    "status" {
        Get-TraichuStatus
    }
    "restart" {
        Restart-TraichuServer
    }
    default {
        Start-TraichuServer
    }
}

# Export functions for manual use
Export-ModuleMember -Function Start-TraichuServer, Stop-TraichuServer, Get-TraichuStatus, Restart-TraichuServer 