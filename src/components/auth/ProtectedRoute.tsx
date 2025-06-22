
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPath?: string; // Custom fallback path instead of login
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/login' 
}) => {
  const { user, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if auth is initialized and user is not authenticated
    if (initialized && !loading && !user && !redirecting) {
      setRedirecting(true);
      
      // Build redirect URL with current path
      const redirectUrl = `${fallbackPath}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      
      // Small delay to prevent redirect loops
      setTimeout(() => {
        navigate(redirectUrl, { replace: true });
      }, 100);
    }
  }, [user, loading, initialized, navigate, location.pathname, location.search, fallbackPath, redirecting]);

  // Show loading while auth is initializing or we're redirecting
  if (!initialized || loading || redirecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">
            {redirecting ? 'Redirecting to login...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if auth failed to initialize properly
  if (initialized && !loading && !user && !redirecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400 mb-6">
            You need to be signed in to access this page. Please log in to continue.
          </p>
          <Button
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
            className="bg-gradient-to-r from-cyan-400 to-violet-400 hover:from-cyan-300 hover:to-violet-300 text-slate-900 font-medium"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
};
