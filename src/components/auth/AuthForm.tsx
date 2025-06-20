import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
// Import a Lucide icon instead of Radix icon
import { AlertTriangle } from "lucide-react";

// Define form schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional(),
  promoCode: z.string().optional(),
  promoCouponId: z.string().optional(),
});

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
  promoCode?: string;
  promoCouponId?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [showReferralField, setShowReferralField] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralChecked, setReferralChecked] = useState(false);
  const [referralMessage, setReferralMessage] = useState<string | null>(null);
  const [isPromoCode, setIsPromoCode] = useState(false);

  const formSchema = type === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:
      type === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", referralCode: "", promoCode: "", promoCouponId: "" },
  });

  const referralCode = watch("referralCode");

  // Extract referral code from URL
  React.useEffect(() => {
    if (type === "register") {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");
      if (refCode) {
        setValue("referralCode", refCode);
        setShowReferralField(true);
        validateReferralCode(refCode);
      }
    }
  }, [type, setValue]);

  const validateReferralCode = async (code: string) => {
    if (!code) return;

    setReferralLoading(true);
    setReferralError(null);
    setReferralChecked(false);
    setReferralMessage(null);
    setIsPromoCode(false); // Kept for backward compatibility

    try {
      // Since the product is now free, we only check for referral codes
      // Stripe promo code validation has been removed

      const { data, error } = await supabase
        .from("referral_codes")
        .select("unique_code")
        .eq("unique_code", code)
        .maybeSingle();

      if (error) throw error;

      // If we found a matching referral code
      if (data) {
        setReferralChecked(true);
        setReferralMessage("Valid referral code");
      } else {
        setReferralError("Invalid code");
      }
    } catch (err) {
      console.error("Error validating code:", err);
      setReferralError("Error validating code");
    } finally {
      setReferralLoading(false);
    }
  };

  const handleFormSubmit = async (data: LoginFormData | RegisterFormData) => {
    // For registration with referral code, ensure it's valid
    if (type === "register" && showReferralField && referralCode) {
      if (!referralChecked) {
        if (!referralError) {
          // Try to validate if not already validated
          await validateReferralCode(referralCode);
        }

        if (referralError) {
          toast.error("Please enter a valid referral code or remove it");
          return;
        }
      }
    }

    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {type === "login" ? "Sign in to your account" : "Create an account"}
        </h1>
        <p className="text-muted-foreground">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Fill in your details to create a new account"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {type === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {type === "login" && (
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {type === "register" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="referral-switch"
                  checked={showReferralField}
                  onCheckedChange={setShowReferralField}
                  disabled={isLoading}
                />
                <Label htmlFor="referral-switch" className="cursor-pointer">
                  I have a referral or promo code
                </Label>
              </div>
            </div>

            {showReferralField && (
              <div className="pt-2">
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral or promo code"
                  {...register("referralCode")}
                  disabled={isLoading || referralLoading}
                  onChange={(e) => {
                    setValue("referralCode", e.target.value);
                    setReferralChecked(false);
                    setReferralError(null);
                    setReferralMessage(null);
                    setIsPromoCode(false);
                  }}
                  onBlur={(e) => validateReferralCode(e.target.value)}
                />
                {referralLoading && (
                  <p className="text-sm text-gray-500 mt-1">Validating code...</p>
                )}
                {referralError && (
                  <p className="text-sm text-destructive mt-1">
                    {referralError}
                  </p>
                )}
                {referralChecked && !referralError && referralCode && (
                  <p className="text-sm text-green-600 mt-1">
                    {referralMessage || "Valid code"}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {type === "login" ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            <>{type === "login" ? "Sign In" : "Create Account"}</>
          )}
        </Button>
      </form>

      <Separator />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <Link
            to={type === "login" ? "/onboarding" : "/login"}
            className="ml-1 text-primary hover:underline font-medium"
          >
            {type === "login" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
