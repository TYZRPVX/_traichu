# 🚀 _traichu Deployment Scripts

Simple deployment scripts for running your _traichu static site locally.

## Quick Start

### macOS/Linux:
```bash
./deploy/deploy.sh
```

### Windows:
```cmd
deploy\deploy.bat
```

### Python (Cross-platform):
```bash
python3 deploy/deploy.py
```

## Custom Port & Host

All scripts accept optional port and host arguments:

### Examples:

**Default (localhost:8080):**
```bash
./deploy/deploy.sh
python3 deploy/deploy.py
```

**Custom port:**
```bash
./deploy/deploy.sh 3000
python3 deploy/deploy.py 3000
deploy\deploy.bat 3000
```

**Network access (for mobile testing):**
```bash
./deploy/deploy.sh 8080 0.0.0.0
python3 deploy/deploy.py 8080 0.0.0.0
deploy\deploy.bat 8080 0.0.0.0
```

**Python script options:**
```bash
python3 deploy/deploy.py --help           # Show help
python3 deploy/deploy.py 3000 --no-browser  # Don't open browser
```

## What Each Script Does

- **Automatically finds available ports** if your chosen port is busy
- **Opens browser automatically** (localhost only, for security)
- **Includes security headers** for local development
- **Works from any directory** - automatically finds your project root
- **Cross-platform compatible** - same functionality on all systems

## Troubleshooting

**Port already in use?** The scripts will automatically find the next available port.

**Python not found?** Install Python 3.6+ from [python.org](https://python.org)

**Permission denied?** On macOS/Linux, make the script executable:
```bash
chmod +x deploy/deploy.sh
```

**Can't find index.html?** Make sure you're running from the project root, or the scripts will guide you. 