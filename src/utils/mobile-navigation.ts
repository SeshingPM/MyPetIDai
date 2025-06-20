/**
 * Utility functions for handling mobile navigation and window state
 */

/**
 * Opens a URL in a new window/tab while preserving the main window's state
 */
export const openUrlPreserveState = (url: string) => {
  // Set a flag indicating we're intentionally opening a new window
  sessionStorage.setItem("intentionalNavigation", "true");

  // Open the URL
  window.open(url, "_blank");
};

/**
 * Checks if the current platform is iOS
 */
export const isIOS = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
    (/iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !/MSStream/i.test(navigator.userAgent))
  );
};

/**
 * Checks if we're running on a mobile device
 */
export const isMobile = () => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
};

/**
 * Preserves the current page state before navigation
 */
export const preservePageState = () => {
  const scrollPos = window.scrollY;
  sessionStorage.setItem("scrollPosition", scrollPos.toString());
  sessionStorage.setItem(
    "pageState",
    window.location.pathname + window.location.search
  );
};

/**
 * Restores the page state after returning from navigation
 */
export const restorePageState = () => {
  const savedScrollPos = sessionStorage.getItem("scrollPosition");
  const savedPageState = sessionStorage.getItem("pageState");

  if (savedScrollPos && savedPageState) {
    // Only restore if we're on the same page
    if (savedPageState === window.location.pathname + window.location.search) {
      window.scrollTo(0, parseInt(savedScrollPos));
    }

    // Clean up
    sessionStorage.removeItem("scrollPosition");
    sessionStorage.removeItem("pageState");
  }
};
