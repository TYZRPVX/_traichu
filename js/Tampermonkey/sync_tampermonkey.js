#!/usr/bin/env node

// cross-platform cp -R script for Tampermonkey folder sync
const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

// Source and destination paths
const src = path.join(os.homedir(), 'git', 'dotfiles', 'common', 'Browser', 'Tampermonkey');
const dest = path.join(os.homedir(), 'Projects', 'Github', '_traichu', 'js');

// Platform-specific command
let cmd;
if (process.platform === 'win32') {
  // Use robocopy on Windows (robocopy <src> <dest> /E /NFL /NDL /NJH /NJS /nc /ns /np)
  cmd = `robocopy "${src}" "${dest}\\Tampermonkey" /E /NFL /NDL /NJH /NJS /nc /ns /np`;
} else {
  // Use cp -R on macOS/Linux
  cmd = `cp -R "${src}" "${dest}"`;
}

try {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
  console.log('Copy completed successfully.');
} catch (err) {
  console.error('Copy failed:', err.message);
  process.exit(1);
}
