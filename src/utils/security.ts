/**
 * Security & Anti-Theft Protection System
 * Prevents content copying, code inspection, right-click, devtools shortcuts, and printing.
 */

export function initAntiTheftProtection(): () => void {
  // 1. Disable Right Click Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    // Allow right click ONLY inside input fields and textareas if needed, otherwise block everywhere
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    return false;
  };

  // 2. Prevent common keyboard shortcuts for inspection, viewing source, copying, saving, printing
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode || e.which;

    const target = e.target as HTMLElement;
    const isInputField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    // Block F12
    if (keyCode === 123 || key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element selector)
    if (ctrlOrCmd && e.shiftKey && (key === 'I' || key === 'J' || key === 'C')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+U (View Source)
    if (ctrlOrCmd && key === 'U') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+S (Save Page)
    if (ctrlOrCmd && key === 'S') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+P (Print Page / Save as PDF)
    if (ctrlOrCmd && key === 'P') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+C (Copy) and Ctrl+A (Select All) outside of input fields
    if (ctrlOrCmd && (key === 'C' || key === 'A' || key === 'X') && !isInputField) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 3. Disable Dragging of Images and Text
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
    return false;
  };

  // 4. Disable Copy / Cut events outside input fields
  const handleCopy = (e: ClipboardEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', '© MP परीक्षा सेतु — Content is copyrighted and strictly protected.');
    }
    return false;
  };

  // 5. Console Warning for anyone opening DevTools
  try {
    const bannerStyle = 'color: #D4A017; font-size: 20px; font-weight: bold; background: #7A2A1E; padding: 8px 16px; border-radius: 4px;';
    const warningStyle = 'color: #ff3333; font-size: 14px; font-weight: bold;';
    console.log('%c🛡️ MP परीक्षा सेतु — Security Active', bannerStyle);
    console.log('%c⚠️ चेतावनी: इस पोर्टल की टेस्ट सामग्री, प्रश्न और कोड कॉपीराइट के तहत सुरक्षित हैं। किसी भी प्रकार की चोरी, रिवर्स इंजीनियरिंग या अनधिकृत प्रतिलिपि कानूनी अपराध है।', warningStyle);
  } catch {
    // Ignore console errors
  }

  // Attach event listeners
  document.addEventListener('contextmenu', handleContextMenu, { capture: true });
  document.addEventListener('keydown', handleKeyDown, { capture: true });
  document.addEventListener('dragstart', handleDragStart, { capture: true });
  document.addEventListener('copy', handleCopy, { capture: true });
  document.addEventListener('cut', handleCopy, { capture: true });

  // Return cleanup function
  return () => {
    document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    document.removeEventListener('keydown', handleKeyDown, { capture: true });
    document.removeEventListener('dragstart', handleDragStart, { capture: true });
    document.removeEventListener('copy', handleCopy, { capture: true });
    document.removeEventListener('cut', handleCopy, { capture: true });
  };
}
