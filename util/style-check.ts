export function checkForStyleOverrides() {
  if (typeof window === 'undefined') return false;

  const criticalElements = [
    { selector: '.bg-gradient-to-tl', property: 'background-image' },
    { selector: '.from-black', property: 'background-color' },
    { selector: 'canvas', property: 'background-color' }
  ];

  let hasOverrides = false;
  criticalElements.forEach(({ selector, property }) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const computedStyle = window.getComputedStyle(element);
    const appliedValue = computedStyle[property as any];
    
    // Get all stylesheets that aren't ours
    const externalStylesheets = Array.from(document.styleSheets).filter(sheet => {
      try {
        const href = sheet.href;
        if (!href) return false;
        return !href.includes('portfolio-ten-blond-79.vercel.app') && 
               !href.includes('spencerpresley.com');
      } catch (e) {
        return false; // CORS blocked stylesheet, likely an extension
      }
    });

    if (externalStylesheets.length > 0) {
      hasOverrides = true;
    }
  });

  return hasOverrides;
} 