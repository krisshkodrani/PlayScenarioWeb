import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authService, User, RegisterCredentials } from '@/services/authService';
import { Session } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (credentials: RegisterCredentials) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: string | null }>;
  isAuthenticated: boolean;
  initialized: boolean; // New flag to track if auth state is initialized
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth', `Auth state changed: ${event}`, { 
          userId: session?.user?.id,
          email: session?.user?.email 
        });
        
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      logger.debug('Auth', 'Attempting user registration', { email, username });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      logger.info('Auth', 'User registration successful', { 
        userId: data.user?.id,
        email: data.user?.email 
      });
      
      return { data, error: null };
    } catch (error) {
      logger.error('Auth', 'Registration failed', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      logger.debug('Auth', 'Attempting user sign in', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      logger.info('Auth', 'User signed in successfully', { 
        userId: data.user?.id,
        email: data.user?.email 
      });
      
      return { data, error: null };
    } catch (error) {
      logger.error('Auth', 'Sign in failed', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      logger.debug('Auth', 'Attempting user sign out');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      logger.info('Auth', 'User signed out successfully');
    } catch (error) {
      logger.error('Auth', 'Sign out failed', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
