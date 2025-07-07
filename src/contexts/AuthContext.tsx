
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authService, RegisterCredentials } from '@/services/authService';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Use Supabase's User type directly to avoid conflicts
interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (credentials: RegisterCredentials) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: string | null }>;
  isAuthenticated: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth', `Auth state changed: ${event}`, { 
          userId: session?.user?.id,
          email: session?.user?.email 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      logger.debug('Auth', 'Attempting user registration', { 
        email: credentials.email, 
        username: credentials.username 
      });
      
      const { user, error } = await authService.signUp(credentials);

      if (error) {
        const errorMessage = authService.getErrorMessage(error);
        logger.error('Auth', 'Registration failed', error);
        return { error: errorMessage };
      }

      logger.info('Auth', 'User registration successful', { 
        userId: user?.id,
        email: user?.email 
      });
      
      return { error: null };
    } catch (error) {
      logger.error('Auth', 'Registration failed', error);
      return { error: 'An unexpected error occurred during registration.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      logger.debug('Auth', 'Attempting user sign in', { email });
      
      const { user, error } = await authService.signIn({ email, password });

      if (error) {
        const errorMessage = authService.getErrorMessage(error);
        logger.error('Auth', 'Sign in failed', error);
        return { error: errorMessage };
      }

      logger.info('Auth', 'User signed in successfully', { 
        userId: user?.id,
        email: user?.email 
      });
      
      return { error: null };
    } catch (error) {
      logger.error('Auth', 'Sign in failed', error);
      return { error: 'An unexpected error occurred during sign in.' };
    }
  };

  const signOut = async () => {
    try {
      logger.debug('Auth', 'Attempting user sign out');
      
      const { error } = await authService.signOut();
      if (error) {
        logger.error('Auth', 'Sign out failed', error);
        throw error;
      }

      logger.info('Auth', 'User signed out successfully');
    } catch (error) {
      logger.error('Auth', 'Sign out failed', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email);
      if (error) {
        const errorMessage = authService.getErrorMessage(error);
        return { error: errorMessage };
      }
      return { error: null };
    } catch (error) {
      logger.error('Auth', 'Password reset failed', error);
      return { error: 'An unexpected error occurred.' };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await authService.resendVerificationEmail(email);
      if (error) {
        const errorMessage = authService.getErrorMessage(error);
        return { error: errorMessage };
      }
      return { error: null };
    } catch (error) {
      logger.error('Auth', 'Email resend failed', error);
      return { error: 'An unexpected error occurred.' };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendVerificationEmail,
    isAuthenticated: !!user,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
