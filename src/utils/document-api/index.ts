// Export all document API functions
export * from "./mappers";
export * from "./fetch/index";
export * from "./delete";
export * from "./update";
export * from "./share";
export * from "./archive";
export * from "./refresh";

// Explicitly re-export the bookmark functionality to make the terminology transition clear
// Both functions work identically, but toggleDocumentBookmark is preferred for new code
// These functions now accept an optional showToast parameter (default: false) to control
// whether the function itself will show success/error toasts
import { toggleDocumentFavorite, toggleDocumentBookmark } from "./update";
export { toggleDocumentFavorite, toggleDocumentBookmark };
