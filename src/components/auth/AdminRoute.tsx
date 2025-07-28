import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, initialized, user } = useAuth();
  const location = useLocation();
  const [serverValidated, setServerValidated] = useState(false);
  const [validating, setValidating] = useState(true);

  // Server-side admin validation to prevent client-side bypasses
  useEffect(() => {
    const validateAdminAccess = async () => {
      if (!user || !isAuthenticated) {
        setValidating(false);
        return;
      }

      try {
        // Call server-side function to verify admin status
        const { data, error } = await supabase.rpc('verify_admin_access');
        
        if (error) {
          console.error('Admin verification failed:', error);
          setServerValidated(false);
        } else {
          setServerValidated(data === true);
        }
      } catch (error) {
        console.error('Admin verification error:', error);
        setServerValidated(false);
      } finally {
        setValidating(false);
      }
    };

    if (initialized && isAuthenticated) {
      validateAdminAccess();
    } else if (initialized) {
      setValidating(false);
    }
  }, [user, isAuthenticated, initialized]);

  // Show loading while auth is initializing or validating admin access
  if (!initialized || loading || validating) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not admin (both client and server-side checks)
  if (!isAdmin || !serverValidated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;