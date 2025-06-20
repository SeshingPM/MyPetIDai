
import { User, Session } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  error?: {
    message: string;
    status?: number;
  };
  session?: Session;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  lastAuthEvent: string | null;
  lastAuthEventTime: number | null;
  isSessionRefresh: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, userData: any) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  changePassword: (password: string) => Promise<AuthResult>;
  updateUserMetadata: (metadata: Record<string, any>) => Promise<User | null>;
  userMetadata?: Record<string, any>;
}
