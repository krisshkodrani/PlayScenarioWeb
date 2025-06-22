
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: any;
  created_at: string;
}

export class AuthService {
  async signIn(credentials: LoginCredentials): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      return {
        user: data.user as User | null,
        error
      };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      return {
        user: null,
        error: error as AuthError
      };
    }
  }

  async signUp(credentials: RegisterCredentials): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: credentials.username ? { username: credentials.username } : undefined
        }
      });

      return {
        user: data.user as User | null,
        error
      };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      return {
        user: null,
        error: error as AuthError
      };
    }
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      return { error: error as AuthError };
    }
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      return { error: error as AuthError };
    }
  }

  async resendVerificationEmail(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      console.error('Unexpected error during email resend:', error);
      return { error: error as AuthError };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user as User | null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getCurrentSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  getErrorMessage(error: AuthError | Error | unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as AuthError).message;
      
      // Map Supabase error messages to user-friendly text
      const errorMap: Record<string, string> = {
        'Invalid login credentials': 'Incorrect email or password. Please try again.',
        'Email not confirmed': 'Please check your email and click the confirmation link.',
        'User not found': 'No account found with this email address.',
        'Invalid email': 'Please enter a valid email address.',
        'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
        'Email already registered': 'An account with this email already exists.',
        'User already registered': 'An account with this email already exists.',
        'Signup requires a valid password': 'Please enter a valid password.',
        'Email rate limit exceeded': 'Too many email requests. Please wait before trying again.',
        'For security purposes, you can only request this after 60 seconds': 'Please wait 60 seconds before requesting another email.',
        'Network request failed': 'Network error. Please check your connection and try again.',
        'Failed to fetch': 'Connection error. Please check your internet connection.'
      };

      return errorMap[message] || message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  // Helper method to check if user session is valid
  async isSessionValid(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return false;
      
      // Check if token is expired
      const now = Date.now() / 1000;
      return session.expires_at ? session.expires_at > now : true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  // Helper method to refresh session if needed
  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return { session: null, error };
      }
      
      return { session, error: null };
    } catch (error) {
      console.error('Unexpected error refreshing session:', error);
      return { session: null, error: error as AuthError };
    }
  }
}

export const authService = new AuthService();
