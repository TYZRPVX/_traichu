# 🚀 Auto-Start _traichu Server (PowerShell)

This guide shows how to automatically start your _traichu server silently when you open a new PowerShell terminal on Windows.

## 📋 Setup Instructions

### 1. Update the script path

Edit `deploy/auto-start.ps1` and update the path on line 6:
```powershell
$TRAICHU_DIR = "C:\Users\x\Projects\Github\_traichu"  # Update this to your actual path
```

### 2. Check PowerShell execution policy

First, check your current execution policy:
```powershell
Get-ExecutionPolicy
```

If it's `Restricted`, you need to change it to allow script execution:
```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Find your PowerShell profile location

```powershell
# Check if profile exists
Test-Path $PROFILE

# Show profile path
$PROFILE
```

Common locations:
- **PowerShell 5.x:** `C:\Users\[Username]\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
- **PowerShell 7+:** `C:\Users\[Username]\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`

### 4. Create/Edit your PowerShell profile

If the profile doesn't exist, create it:
```powershell
# Create the profile directory if it doesn't exist
New-Item -ItemType Directory -Path (Split-Path $PROFILE) -Force

# Create the profile file
New-Item -ItemType File -Path $PROFILE -Force
```

### 5. Add auto-start to your profile

Add this line to your PowerShell profile:
```powershell
# Auto-start _traichu server silently
& "C:\Users\x\Projects\Github\_traichu\deploy\auto-start.ps1"
```

**To edit your profile:**
```powershell
# Using notepad
notepad $PROFILE

# Using VS Code (if installed)
code $PROFILE

# Using PowerShell ISE
ise $PROFILE
```

### 6. Reload your PowerShell

```powershell
# Reload the profile
. $PROFILE

# Or restart PowerShell
```

## 🎯 How It Works

- **🔇 Silent startup:** Server starts in background with no output
- **🧠 Smart detection:** Won't start multiple instances
- **🔄 Auto-cleanup:** Handles stale processes
- **⚡ Fast startup:** Doesn't slow down PowerShell launch

## 🔧 Manual Control

You can manually control the server using these commands:

```powershell
# Check status
& ".\deploy\auto-start.ps1" -Action status

# Stop server
& ".\deploy\auto-start.ps1" -Action stop

# Start server
& ".\deploy\auto-start.ps1" -Action start

# Restart server
& ".\deploy\auto-start.ps1" -Action restart
```

Or use the exported functions directly (after sourcing the script):
```powershell
Get-TraichuStatus      # Check status
Stop-TraichuServer     # Stop server
Start-TraichuServer    # Start server
Restart-TraichuServer  # Restart server
```

## ⚙️ Configuration

Edit `deploy/auto-start.ps1` to customize:

```powershell
$TRAICHU_PORT = 8080          # Change port
$TRAICHU_HOST = "localhost"   # Change host
$TRAICHU_DIR = "C:\Your\Path" # Change project path
```

## 🛠️ Troubleshooting

### Execution Policy Issues
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or bypass for this session only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Script Not Running
- **Check the path** in `$TRAICHU_DIR`
- **Verify Python is installed** and in PATH: `python --version`
- **Check if script is blocked:** Right-click → Properties → Unblock

### Multiple Servers Running
```powershell
# Check status
Get-TraichuStatus

# Stop all instances
Stop-TraichuServer
```

### Profile Not Loading
```powershell
# Check if profile exists
Test-Path $PROFILE

# Check profile content
Get-Content $PROFILE

# Test profile manually
. $PROFILE
```

## 🔍 What Gets Added to Your PowerShell Profile

Just one line:
```powershell
& "C:\Path\To\Your\_traichu\deploy\auto-start.ps1"
```

## 📝 Alternative Setup Methods

### Method 1: Direct function import
Add this to your profile instead:
```powershell
# Import _traichu auto-start functions
. "C:\Users\x\Projects\Github\_traichu\deploy\auto-start.ps1"
```

### Method 2: Module-style import
```powershell
# Import as module
Import-Module "C:\Users\x\Projects\Github\_traichu\deploy\auto-start.ps1" -Force
```

### Method 3: Conditional loading
```powershell
# Only load if project exists
$TraichuPath = "C:\Users\x\Projects\Github\_traichu\deploy\auto-start.ps1"
if (Test-Path $TraichuPath) {
    & $TraichuPath
}
```

## 🎮 Testing Your Setup

1. **Close all PowerShell windows**
2. **Open a new PowerShell window**
3. **Check if server started:**
   ```powershell
   Get-TraichuStatus
   ```
4. **Access your site:** `http://localhost:8080`

## 🚫 Disable Auto-Start

To disable auto-start:
1. **Edit your PowerShell profile:** `notepad $PROFILE`
2. **Comment out or remove the line:**
   ```powershell
   # & "C:\Users\x\Projects\Github\_traichu\deploy\auto-start.ps1"
   ```
3. **Reload:** `. $PROFILE`

---

**Need help?** Check the troubleshooting section above or run `Get-Help about_Profiles` in PowerShell. 