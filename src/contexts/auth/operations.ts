import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthResult } from "./types";
import { detectBrowser } from "@/utils/browser";
import logger from "@/utils/logger";

interface UserMetadata {
  name?: string;
  full_name?: string;
  [key: string]: any;
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      success: true,
      session: data.session,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "An error occurred during sign in",
      },
    };
  }
}

export async function signUp(
  email: string,
  password: string,
  userData: UserMetadata
): Promise<AuthResult> {
  try {
    // Format user metadata
    const userMetadata: UserMetadata = {
      full_name: userData.name || "",
      ...userData,
    };

    // Standard signup with user metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      success: true,
      session: data.session,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "An error occurred during sign up",
      },
    };
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function refreshUserData(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/**
 * Updates user metadata in Supabase
 * @param metadata Object containing metadata key-value pairs to update
 * @returns Updated user data or null if operation failed
 */
export async function updateUserMetadata(metadata: Record<string, any>): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });
    
    if (error) {
      logger.error('Error updating user metadata:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    logger.error('Exception updating user metadata:', error);
    return null;
  }
}

export async function changePassword(password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return {
        success: false,
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || "An error occurred during password change",
      },
    };
  }
}
