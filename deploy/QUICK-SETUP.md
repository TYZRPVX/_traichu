# ⚡ Quick Auto-Start Setup

Choose your platform and follow the steps to auto-start _traichu server on terminal launch.

## 🍎 macOS/Linux (Bash/Zsh)

### 1. Update path in script:
```bash
# Edit deploy/auto-start.sh line 7:
TRAICHU_DIR="/Users/x/Projects/Github/_traichu"  # Your actual path
```

### 2. Add to shell profile:
```bash
# Add this line to ~/.zshrc or ~/.bashrc:
source /Users/x/Projects/Github/_traichu/deploy/auto-start.sh
```

### 3. Reload shell:
```bash
source ~/.zshrc
```

**Manual control:**
```bash
./deploy/auto-start.sh status    # Check status
./deploy/auto-start.sh stop      # Stop server
./deploy/auto-start.sh restart   # Restart server
```

---

## 🪟 Windows (PowerShell)

### 1. Update path in script:
```powershell
# Edit deploy/auto-start.ps1 line 6:
$TRAICHU_DIR = "C:\Users\x\Projects\Github\_traichu"  # Your actual path
```

### 2. Set execution policy (if needed):
```powershell
# Run as Administrator:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Add to PowerShell profile:
```powershell
# Find your profile location:
$PROFILE

# Add this line to your profile:
& "C:\Users\x\Projects\Github\_traichu\deploy\auto-start.ps1"
```

### 4. Reload PowerShell:
```powershell
. $PROFILE
```

**Manual control:**
```powershell
& ".\deploy\auto-start.ps1" -Action status    # Check status
& ".\deploy\auto-start.ps1" -Action stop      # Stop server
& ".\deploy\auto-start.ps1" -Action restart   # Restart server
```

---

## ✅ Test Your Setup

1. **Close all terminals**
2. **Open a new terminal**
3. **Check if server is running:**
   - **macOS/Linux:** `./deploy/auto-start.sh status`
   - **Windows:** `& ".\deploy\auto-start.ps1" -Action status`
4. **Access your site:** `http://localhost:8080`

## 🎯 What You Get

- ✅ **Silent startup** - Server starts automatically, no output
- ✅ **Smart detection** - Won't start multiple instances
- ✅ **Fast launch** - Doesn't slow down terminal startup
- ✅ **Easy control** - Manual start/stop/status commands
- ✅ **Cross-platform** - Works on macOS, Linux, and Windows

---

**Need detailed instructions?** See [AUTO-START.md](AUTO-START.md) or [POWERSHELL-AUTO-START.md](POWERSHELL-AUTO-START.md) 