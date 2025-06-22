
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authService, User, RegisterCredentials } from '@/services/authService';
import { Session } from '@supabase/supabase-js';

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user as User | null);
          setInitialized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (mounted) {
          setSession(session);
          setUser(session?.user as User | null);
          
          // Handle specific auth events
          if (event === 'SIGNED_OUT') {
            // Clear any cached data
            setUser(null);
            setSession(null);
          } else if (event === 'TOKEN_REFRESHED') {
            // Session was refreshed, update state
            console.log('Token refreshed successfully');
          } else if (event === 'SIGNED_IN') {
            console.log('User signed in successfully');
          }
          
          if (!initialized) {
            setInitialized(true);
            setLoading(false);
          }
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { user, error } = await authService.signIn({ email, password });
      
      if (error) {
        return { error: authService.getErrorMessage(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signin error:', error);
      return { error: 'An unexpected error occurred during sign in.' };
    }
  };

  const signUp = async (credentials: RegisterCredentials): Promise<{ error: string | null }> => {
    try {
      const { user, error } = await authService.signUp(credentials);
      
      if (error) {
        return { error: authService.getErrorMessage(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error: 'An unexpected error occurred during sign up.' };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authService.signOut();
      // State will be updated by the auth state change listener
    } catch (error) {
      console.error('Error signing out:', error);
      // Force clear state even if signout fails
      setUser(null);
      setSession(null);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        return { error: authService.getErrorMessage(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      return { error: 'An unexpected error occurred during password reset.' };
    }
  };

  const resendVerificationEmail = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await authService.resendVerificationEmail(email);
      
      if (error) {
        return { error: authService.getErrorMessage(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected verification email error:', error);
      return { error: 'An unexpected error occurred while sending verification email.' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    resendVerificationEmail,
    isAuthenticated: !!user,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
