// ==UserScript==
// @name         X Parse Portfolio to CSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Parse clipboard portfolio text to CSV format (Symbol, Quantity)
// @author       X
// @note         Press Alt + P to parse clipboard and copy as CSV
// @match        https://www.google.com/finance/*
// @icon         https://www.gstatic.com/finance/favicon/favicon.png
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_common.js
// @require      https://cdn.jsdelivr.net/gh/TYZRPVX/_traichu@main/js/Tampermonkey/x_parse_portfolio.js
// ==/UserScript==

// @require      file:///Users/x/git/dotfiles/common/Browser/Tampermonkey/x_common.js
// @require      file://C:/git/dotfiles/common/Browser/Tampermonkey/x_common.js

(function() {
    'use strict';

    function parsePortfolioText(text) {
        const lines = text.trim().split('\n').map(line => line.trim()).filter(line => line !== '');
        const results = [];
        
        // Skip header lines (SYMBOL, NAME, PRICE, QUANTITY, VALUE)
        let i = 0;
        while (i < lines.length && lines[i].match(/^(SYMBOL|NAME|PRICE|QUANTITY|VALUE)$/)) {
            i++;
        }
        
        // Parse data in groups of 7 lines each
        // Format: SYMBOL, NAME, PRICE, QUANTITY, CHANGE_VALUE, PERCENTAGE, TOTAL_VALUE
        // Example:
        // V                    <- SYMBOL (line 0)
        // Visa Inc             <- NAME (line 1)
        // $347.82              <- PRICE (line 2)
        // 6                    <- QUANTITY (line 3)
        // +$2.64               <- CHANGE_VALUE (line 4)
        // 0.13%                <- PERCENTAGE (line 5)
        // $2,086.92            <- TOTAL_VALUE (line 6) *** WE WANT THIS FOR VALUE ***
        
        while (i + 6 < lines.length) {
            const symbol = lines[i];
            const name = lines[i + 1];
            const price = lines[i + 2];
            const quantity = lines[i + 3];
            const totalValue = lines[i + 6];  // Extract total portfolio value for each position
            
            // Validate that we're reading the right pattern
            // SYMBOL should not start with $ or contain % or +/-$
            // PRICE should start with $
            // QUANTITY should be a number (possibly with comma or decimal)
            const isValidSymbol = symbol && !symbol.startsWith('$') && !symbol.includes('%') && !/^[+\-]\$/.test(symbol);
            const isValidPrice = price && price.startsWith('$');
            const isValidQuantity = quantity && /^[\d,\.]+$/.test(quantity);
            
            if (isValidSymbol && isValidPrice && isValidQuantity) {
                // Extract numeric value from totalValue (remove $ and commas)
                const cleanValue = totalValue.replace(/[$,]/g, '');
                
                results.push({
                    symbol: symbol,
                    value: parseFloat(cleanValue) || 0
                });
                
                // Move to next entry (7 lines per entry)
                i += 7;
            } else {
                // If pattern doesn't match, move forward by 1 and try again
                i++;
            }
        }
        
        // Calculate portfolio percentages
        const totalPortfolioValue = results.reduce((sum, item) => sum + item.value, 0);
        results.forEach(item => {
            item.valuePercent = totalPortfolioValue > 0 ? ((item.value / totalPortfolioValue) * 100).toFixed(2) : 0;
        });
        
        return results;
    }

    function convertToCSV(data) {
        if (data.length === 0) {
            return 'SYMBOL,VALUE,VALUE_PERCENT';
        }
        
        const header = 'SYMBOL,VALUE,VALUE_PERCENT';
        const rows = data.map(item => `${item.symbol},${item.value.toFixed(2)},${item.valuePercent}%`);
        return [header, ...rows].join('\n');
    }

    function parseClipboardToCSV() {
        // Create a temporary textarea to paste clipboard content
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        // Execute paste command
        const success = document.execCommand('paste');
        
        if (!success) {
            document.body.removeChild(textarea);
            showToast('⚠ Please paste manually (Ctrl+V / Cmd+V)');
            
            // Keep textarea for manual paste
            const manualTextarea = document.createElement('textarea');
            manualTextarea.style.position = 'fixed';
            manualTextarea.style.top = '50%';
            manualTextarea.style.left = '50%';
            manualTextarea.style.transform = 'translate(-50%, -50%)';
            manualTextarea.style.width = '400px';
            manualTextarea.style.height = '300px';
            manualTextarea.style.padding = '10px';
            manualTextarea.style.border = '2px solid #4CAF50';
            manualTextarea.style.borderRadius = '8px';
            manualTextarea.style.zIndex = '999999';
            manualTextarea.style.background = 'white';
            manualTextarea.style.fontSize = '14px';
            manualTextarea.placeholder = 'Paste your portfolio data here (Ctrl+V / Cmd+V), then press Enter...';
            document.body.appendChild(manualTextarea);
            manualTextarea.focus();
            
            manualTextarea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    const clipboardText = manualTextarea.value;
                    document.body.removeChild(manualTextarea);
                    processClipboardText(clipboardText);
                } else if (e.key === 'Escape') {
                    document.body.removeChild(manualTextarea);
                }
            });
            return;
        }
        
        const clipboardText = textarea.value;
        document.body.removeChild(textarea);
        
        processClipboardText(clipboardText);
    }
    
    function processClipboardText(clipboardText) {
        try {
            if (!clipboardText || clipboardText.trim() === '') {
                showToast('Clipboard is empty!');
                return;
            }
            
            // Parse the text
            const parsedData = parsePortfolioText(clipboardText);
            
            if (parsedData.length === 0) {
                showToast('No valid data found in clipboard');
                log('Failed to parse clipboard text');
                return;
            }
            
            // Convert to CSV
            const csvOutput = convertToCSV(parsedData);
            
            // Copy to clipboard
            GM_setClipboard(csvOutput, 'text');
            
            log(`Parsed ${parsedData.length} entries`);
            log(csvOutput);
            showToast(`✓ Parsed ${parsedData.length} entries to CSV`);
            
        } catch (error) {
            log(`Error: ${error.message}`);
            showToast(`Error: ${error.message}`);
        }
    }

    function main() {
        // Only run in top window, not iframes
        if (window.top !== window.self) return;

        // Register menu command
        GM_registerMenuCommand("Parse Portfolio to CSV", parseClipboardToCSV);
    }

    main();
})();

