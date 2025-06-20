/**
 * Simple browser detection utility to help with debugging and logging
 * Especially useful for identifying iOS Safari issues
 */
export function detectBrowser() {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';

  // Safari detection
  if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
    name = 'Safari';
    // Extract Safari version
    const safariMatch = userAgent.match(/Version\/(\d+(\.\d+)?)/);
    if (safariMatch) {
      version = safariMatch[1];
    }
  } 
  // Chrome detection
  else if (userAgent.indexOf('Chrome') !== -1) {
    name = 'Chrome';
    // Extract Chrome version
    const chromeMatch = userAgent.match(/Chrome\/(\d+(\.\d+)?)/);
    if (chromeMatch) {
      version = chromeMatch[1];
    }
  } 
  // Firefox detection
  else if (userAgent.indexOf('Firefox') !== -1) {
    name = 'Firefox';
    // Extract Firefox version
    const firefoxMatch = userAgent.match(/Firefox\/(\d+(\.\d+)?)/);
    if (firefoxMatch) {
      version = firefoxMatch[1];
    }
  } 
  // Edge detection
  else if (userAgent.indexOf('Edg') !== -1) {
    name = 'Edge';
    // Extract Edge version
    const edgeMatch = userAgent.match(/Edg\/(\d+(\.\d+)?)/);
    if (edgeMatch) {
      version = edgeMatch[1];
    }
  }

  // Device detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  return {
    name,
    version,
    userAgent,
    isMobile,
    isIOS,
    isAndroid
  };
}
