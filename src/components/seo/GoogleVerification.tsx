import React from "react";
import { Helmet } from "react-helmet-async";

interface GoogleVerificationProps {
  verificationId?: string;
}

/**
 * GoogleVerification component for Search Console validation
 *
 * MIGRATION NOTE: When migrating to Next.js, replace this with metadata
 * in the app/layout.tsx file using the Next.js metadata API.
 *
 * @example
 * ```tsx
 * // Next.js migration
 * export const metadata = {
 *   verification: {
 *     google: "YOUR_VERIFICATION_ID"
 *   }
 * }
 * ```
 */
const GoogleVerification: React.FC<GoogleVerificationProps> = ({
  verificationId = "G-VERIFICATION-CODE",
}) => {
  return (
    <Helmet>
      <meta name="google-site-verification" content={verificationId} />
    </Helmet>
  );
};

export default GoogleVerification;
