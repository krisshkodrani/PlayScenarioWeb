
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: any;
  created_at: string;
}

export class AuthService {
  async signIn(credentials: LoginCredentials): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    return {
      user: data.user as User | null,
      error
    };
  }

  async signUp(credentials: LoginCredentials): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    return {
      user: data.user as User | null,
      error
    };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user as User | null;
  }

  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
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
      };

      return errorMap[message] || message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
}

export const authService = new AuthService();
