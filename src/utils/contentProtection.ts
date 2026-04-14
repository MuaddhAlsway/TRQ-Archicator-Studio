/**
 * Content Protection Utilities
 * Prevents screenshots, copying, and pasting on portfolio pages
 * Uses JavaScript only - no CSS needed
 */

// Disable right-click context menu
export function disableRightClick() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });
}

// Disable keyboard shortcuts for copying/saving
export function disableKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Disable Ctrl+C, Ctrl+X, Ctrl+V
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+S (Save)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+P (Print)
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      return false;
    }

    // Disable F12 (Developer Tools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+Shift+I (Developer Tools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+Shift+C (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+Shift+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'j') {
      e.preventDefault();
      return false;
    }

    // Disable Ctrl+Shift+K (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'k') {
      e.preventDefault();
      return false;
    }
  });
}

// Disable text selection
export function disableTextSelection() {
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('mousedown', (e) => {
    if (e.detail > 1) {
      e.preventDefault();
      return false;
    }
  });
}

// Disable drag and drop
export function disableDragDrop() {
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
  });
}

// Disable copy event
export function disableCopy() {
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  });
}

// Disable cut event
export function disableCut() {
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  });
}

// Disable paste event
export function disablePaste() {
  document.addEventListener('paste', (e) => {
    e.preventDefault();
    return false;
  });
}

// Detect developer tools
export function detectDeveloperTools() {
  const threshold = 160;
  
  setInterval(() => {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      // Developer tools detected
      console.clear();
      document.body.innerHTML = '';
      window.location.href = 'about:blank';
    }
  }, 500);
}

// Disable print
export function disablePrint() {
  window.print = function() {
    console.warn('Printing is disabled');
    return false;
  };
}

// Add watermark to prevent screenshots (JavaScript only) - DISABLED (invisible only)
export function addScreenshotWatermark() {
  // Watermark functionality disabled - protection applied invisibly via CSS only
  // No visible watermark on screen
}

// Disable inspect element
export function disableInspectElement() {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable F12
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
  });

  // Disable Ctrl+Shift+I
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'i') {
      e.preventDefault();
      return false;
    }
  });
}

// Apply all protections (JavaScript only)
export function applyAllProtections() {
  disableRightClick();
  disableKeyboardShortcuts();
  disableTextSelection();
  disableDragDrop();
  disableCopy();
  disableCut();
  disablePaste();
  disablePrint();
  addScreenshotWatermark();
  disableInspectElement();
  
  // Detect developer tools
  detectDeveloperTools();

  // Add inline styles for protection (no CSS file needed)
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-user-drag: none !important;
      -webkit-touch-callout: none !important;
    }

    body {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }

    img {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      pointer-events: none !important;
      -webkit-user-drag: none !important;
    }

    @media print {
      * {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  console.log('✓ Content protection enabled (JavaScript only)');
}

// Apply selective protection (only on portfolio pages)
export function applyPortfolioProtection() {
  // Only apply on portfolio pages
  if (window.location.hash.includes('portfolio')) {
    applyAllProtections();
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    if (window.location.hash.includes('portfolio')) {
      applyAllProtections();
    }
  });
}
