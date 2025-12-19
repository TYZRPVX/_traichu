# Tampermonkey Scripts

Personal collection of Tampermonkey userscripts for browser automation and productivity.

## Scripts

### x_copy_markdown.js
Quick copy page title and URL in Markdown format: `[Title](URL)`

**Shortcuts:**
- `Alt + J` - Copy as Rich Title (HTML link)
- `Alt + K` - Copy as Markdown `[Title](URL)`
- `Alt + L` - Copy URL only
- `Alt + U` - Copy Title with URL

### x_parse_portfolio.js
Parse Google Finance portfolio clipboard data to CSV format (Symbol, Quantity)

**Shortcuts:**
- `Alt + P` - Parse clipboard portfolio text to CSV

**Usage:**
1. Copy portfolio data from Google Finance
2. Press `Alt + P` on any page
3. CSV data will be copied to clipboard

### x_hackui_monkey.js
UI customization and enhancement scripts for various websites.

### x_hack_css.js
Custom CSS injection for website styling modifications.

### x_shopee_workflow.js
Workflow automation scripts for Shopee internal tools.

### x_common.js
Common utility functions shared across all scripts (toast notifications, logging, etc.)

---

## Sync

OneDrive

## Development

### Sync to CDN
```bash
z _traichu && cd js
node Tampermonkey/sync_tampermonkey.js
$push to github
```

### Force CDN Refresh
```
VISIT https://purge.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_copy_markdown.js
```

### Force Tampermonkey Refresh
```
chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=a97b683d-6889-4884-b41a-b5f56dca0b81+externals
```