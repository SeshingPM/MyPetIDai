import React from "react";
import { Toaster, toast } from "sonner";

export interface AppToasterProps {
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
}

// Add this to make TypeScript happy
declare global {
  interface Window {
    __toastFiltered?: boolean;
  }
}

// Intercept toast calls to filter bookmark notifications in top-center position
const originalSuccess = toast.success;
const originalError = toast.error;

// Only apply filtering if we haven't done so already
if (typeof window !== "undefined" && !window.__toastFiltered) {
  window.__toastFiltered = true;

  // Override success toast
  toast.success = function (message, options) {
    const currentPath = window.location.pathname;
    const isCenterPosition = options?.position === "top-center";
    const isOnDashboard = currentPath.includes("/dashboard");
    const isBookmarkMessage =
      typeof message === "string" &&
      (message.includes("bookmarks") || message.includes("bookmark status"));
    const isReminderMessage =
      typeof message === "string" &&
      (message.includes("Reminder") || message.includes("reminder"));

    // Skip bookmark-related or reminder-related toasts in center position on dashboard
    if (
      isOnDashboard &&
      (isBookmarkMessage || isReminderMessage) &&
      (isCenterPosition || !options?.position)
    ) {
      console.log("Suppressing toast on dashboard:", message);
      return;
    }

    return originalSuccess(message, options);
  };

  // Override error toast
  toast.error = function (message, options) {
    const currentPath = window.location.pathname;
    const isCenterPosition = options?.position === "top-center";
    const isOnDashboard = currentPath.includes("/dashboard");
    const isBookmarkMessage =
      typeof message === "string" &&
      (message.includes("bookmark") || message.includes("bookmarks"));
    const isReminderMessage =
      typeof message === "string" &&
      (message.includes("Reminder") || message.includes("reminder"));

    // Skip bookmark-related or reminder-related error toasts in center position on dashboard
    if (
      isOnDashboard &&
      (isBookmarkMessage || isReminderMessage) &&
      (isCenterPosition || !options?.position)
    ) {
      console.log("Suppressing error toast on dashboard:", message);
      return;
    }

    return originalError(message, options);
  };
}

const AppToaster: React.FC<AppToasterProps> = ({ position = "top-right" }) => {
  // Determine if we're on mobile by checking window width
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Set initial state
    setIsMobile(window.innerWidth < 640);

    // Add listener for window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Toaster
      position={isMobile ? "top-center" : position}
      expand={true}
      richColors={true}
      closeButton={true}
      visibleToasts={isMobile ? 2 : 3}
      toastOptions={{
        duration: 4000,
        className: "toast-custom-class",
        style: {
          maxWidth: isMobile ? "95vw" : "500px",
          fontSize: isMobile ? "0.9rem" : "1rem",
        },
      }}
    />
  );
};

export default AppToaster;
