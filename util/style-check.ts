export function checkForJsonPrettyPrinter(): boolean {
  if (typeof window === 'undefined') return false;

  // JSON Pretty Printer often injects these styles
  const hasJsonPrettyClass = document.querySelector('.json-pretty') !== null;
  const hasJsonPrettyAttr = document.querySelector('[data-json-pretty]') !== null;
  const hasJsonStyles = Array.from(document.styleSheets).some(sheet => {
    try {
      // Check for specific JSON Pretty Printer rules
      const rules = Array.from(sheet.cssRules || []);
      return rules.some(rule => 
        rule.cssText?.includes('json-pretty') || 
        rule.cssText?.includes('background-color: rgb(255, 255, 255)')
      );
    } catch (e) {
      return false;
    }
  });

  return hasJsonPrettyClass || hasJsonPrettyAttr || hasJsonStyles;
} 
