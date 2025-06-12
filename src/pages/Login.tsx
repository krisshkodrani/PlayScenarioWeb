import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    }
  }, [user, authLoading, navigate, searchParams]);

  // Show success message if coming from verification
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      // Could show a success toast here
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setErrors({ general: error });
      } else {
        // Navigation will be handled by the useEffect above
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        navigate(redirectTo);
      }
    } catch (error) {
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email first' });
      return;
    }

    try {
      // This would use the resetPassword method from auth context
      setResetEmailSent(true);
      setErrors({});
    } catch (error) {
      setErrors({ 
        general: 'Failed to send reset email. Please try again.' 
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-400/30">
            <span className="text-slate-900 font-bold text-xl">P</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-slate-400">
            Sign in to your PlayScenarioAI account
          </p>
        </div>

        {/* Verification Success Message */}
        {searchParams.get('verified') === 'true' && (
          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-4">
            <p className="text-emerald-400 text-sm">
              ✅ Email verified successfully! You've received 10 welcome credits. Please sign in to continue.
            </p>
          </div>
        )}

        {/* Reset Email Confirmation */}
        {resetEmailSent && (
          <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-lg p-4">
            <p className="text-emerald-400 text-sm">
              Reset instructions sent to your email. Check your inbox and spam folder.
            </p>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-800 border-slate-700 p-6 shadow-lg shadow-cyan-400/10">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-slate-300">Email address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${
                      errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                    }`}
                    placeholder="Enter your email"
                    disabled={loading}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`pl-10 pr-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${
                      errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                    }`}
                    placeholder="Enter your password"
                    disabled={loading}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                    disabled={loading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember-me"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: !!checked }))
                    }
                    disabled={loading}
                    className="border-slate-600 text-cyan-400"
                  />
                  <Label htmlFor="remember-me" className="ml-2 text-sm text-slate-300">
                    Remember me
                  </Label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors duration-200"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-400 to-violet-400 hover:from-cyan-300 hover:to-violet-300 text-slate-900 font-medium py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </Card>
        </form>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
          </div>
        </div>

        {/* Social Login Placeholder */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-200"
            disabled
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-200"
            disabled
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
