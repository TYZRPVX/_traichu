# 🚀 _traichu Deployment Guide

Simple ways to deploy and run your _traichu static site locally on macOS, Windows, and Linux.

## 📋 Prerequisites

- **Python 3.6+** (recommended) - Available on all platforms

## 🎯 Quick Start

### One-Click Scripts (Recommended)

#### macOS/Linux:
```bash
./deploy/deploy.sh
```

#### Windows:
```cmd
deploy\deploy.bat
```

#### Python (Cross-platform):
```bash
python3 deploy/deploy.py
```

#### Simple Python Server (Your Original Method):
```bash
python3 -m http.server 8080
```

## 📖 Deployment Options

### 1. 🐍 Enhanced Python Script (Recommended)

The `deploy/deploy.py` script provides the best experience:

**Basic usage:**
```bash
python3 deploy/deploy.py
```

**Custom port:**
```bash
python3 deploy/deploy.py 3000
```

**Network access (for mobile testing):**
```bash
python3 deploy/deploy.py 8080 0.0.0.0
```

**Additional options:**
```bash
python3 deploy/deploy.py --help           # Show all options
python3 deploy/deploy.py 3000 --no-browser  # Don't open browser
```

**Features:**
- ✅ Finds available ports automatically
- ✅ Opens browser automatically (localhost only)
- ✅ Adds security headers
- ✅ Clean logging and error handling
- ✅ Graceful shutdown with Ctrl+C

### 2. 📜 Platform-Specific Scripts

#### macOS/Linux Shell Script
```bash
chmod +x deploy/deploy.sh  # Make executable (first time only)
./deploy/deploy.sh         # Default port
./deploy/deploy.sh 3000    # Custom port
./deploy/deploy.sh 3000 0.0.0.0  # Network access
```

#### Windows Batch Script
```cmd
deploy\deploy.bat          # Default port
deploy\deploy.bat 3000     # Custom port
deploy\deploy.bat 3000 0.0.0.0  # Network access
```

### 3. 🌐 Simple HTTP Servers

#### Python (Built-in)
```bash
python3 -m http.server          # Default port 8000
python3 -m http.server 8080     # Custom port
python3 -m http.server 8080 --bind 0.0.0.0  # Network access
```

#### Node.js (if available)
```bash
npx http-server -p 8080 -o      # With auto-open browser
```

## 🔧 Configuration

### Port Selection

All deployment scripts accept a port argument:
- **Default:** 8080 (or next available port)
- **Custom:** Any port number (e.g., 3000, 8000, 9000)
- **Auto-detection:** Scripts automatically find available ports

### Host Configuration

- **localhost** (default) - Local access only
- **0.0.0.0** - Network access (for mobile testing)

⚠️ **Security Warning:** Only use `0.0.0.0` on trusted networks.

## 🌍 Production Deployment

For production deployment, consider these static hosting services:

### GitHub Pages (Free)
1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify (Free tier available)
1. Connect your GitHub repository
2. Deploy automatically on every push
3. Custom domain support

### Vercel (Free tier available)
1. Import your GitHub repository
2. Automatic deployments
3. Edge network distribution

### Traditional Web Hosting
Upload all files to your web server's public directory (usually `public_html` or `www`).

## 🛠️ Troubleshooting

### Port Already in Use
The deployment scripts automatically find available ports. For manual servers, try different ports:
```bash
python3 -m http.server 3000
python3 -m http.server 8081
```

### Python Not Found
- **Windows:** Install from [python.org](https://python.org) and check "Add to PATH"
- **macOS:** Install via Homebrew: `brew install python3`
- **Linux:** `sudo apt install python3` (Ubuntu/Debian)

### Permission Denied
- **macOS/Linux:** Make scripts executable: `chmod +x deploy/deploy.sh`
- **Windows:** Run Command Prompt as Administrator

### Browser Doesn't Open Automatically
Manually navigate to the URL shown in the terminal (usually starts with `http://localhost:`).

## 📱 Mobile Testing

To test on mobile devices on the same network:

1. Use network access: `python3 deploy/deploy.py 8080 0.0.0.0`
2. Find your computer's IP address:
   - **macOS/Linux:** `ifconfig | grep inet`
   - **Windows:** `ipconfig`
3. Access from mobile: `http://YOUR_IP_ADDRESS:8080`

## 🔒 Security Notes

- The deployment scripts include basic security headers
- Only use network access (`0.0.0.0`) on trusted networks
- For production, use HTTPS and proper security configurations

---

**Need help?** Check the troubleshooting section above or see `deploy/README.md` for more examples. 