# 🚀 Auto-Start _traichu Server

This guide shows how to automatically start your _traichu server silently when you open a new terminal.

## 📋 Setup Instructions

### 1. Update the script path

Edit `deploy/auto-start.sh` and update the path on line 7:
```bash
TRAICHU_DIR="/Users/x/Projects/Github/_traichu"  # Update this to your actual path
```

### 2. Add to your .zshrc

Add this line to your `~/.zshrc` file:
```bash
# Auto-start _traichu server silently
source /Users/x/Projects/Github/_traichu/deploy/auto-start.sh
```

**To edit .zshrc:**
```bash
nano ~/.zshrc
# or
code ~/.zshrc
```

### 3. Reload your shell

```bash
source ~/.zshrc
# or open a new terminal
```

## 🎯 How It Works

- **Silent startup:** Server starts in background with no output
- **Smart detection:** Won't start multiple instances
- **PID tracking:** Keeps track of server process
- **Auto-cleanup:** Removes stale PID files

## 🔧 Manual Control

You can manually control the server:

```bash
# Check status
./deploy/auto-start.sh status

# Stop server
./deploy/auto-start.sh stop

# Start server
./deploy/auto-start.sh start

# Restart server
./deploy/auto-start.sh restart
```

## ⚙️ Configuration

Edit `deploy/auto-start.sh` to customize:

```bash
TRAICHU_PORT=8080          # Change port
TRAICHU_HOST="localhost"   # Change host
```

## 🛠️ Troubleshooting

**Server not starting?**
- Check the path in `TRAICHU_DIR`
- Make sure Python 3 is installed
- Verify the script is executable: `chmod +x deploy/auto-start.sh`

**Multiple servers running?**
- Use `./deploy/auto-start.sh status` to check
- Use `./deploy/auto-start.sh stop` to stop

**Want to disable auto-start?**
- Comment out or remove the line from your `~/.zshrc`
- Reload: `source ~/.zshrc`

## 🔍 What Gets Added to .zshrc

Just one line:
```bash
source /path/to/your/_traichu/deploy/auto-start.sh
```

This will:
- ✅ Start server silently on new terminal
- ✅ Not interfere with your terminal startup
- ✅ Only start one instance
- ✅ Work across terminal sessions 