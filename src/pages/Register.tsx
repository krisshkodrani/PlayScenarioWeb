import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordStrengthIndicator, calculatePasswordStrength } from '@/components/auth/PasswordStrengthIndicator';
import { Eye, EyeOff, Lock, Mail, User, Loader2, Check, AlertCircle, Coins } from 'lucide-react';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface RegisterErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signUp, user, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      navigate(redirectTo);
    }
  }, [user, authLoading, navigate, searchParams]);

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Username validation (optional but if provided, must be valid)
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    const passwordStrength = calculatePasswordStrength(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordStrength.isValid) {
      newErrors.password = 'Password must meet minimum requirements';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.username || undefined
      );

      if (error) {
        setErrors({ general: error });
      } else {
        setRegisteredEmail(formData.email);
        setStep('verify');
      }
    } catch (error) {
      setErrors({ 
        general: 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await signUp(
        registeredEmail,
        formData.password,
        formData.username || undefined
      );
    } catch (error) {
      setErrors({ 
        general: 'Failed to resend verification email. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderRegistrationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-slate-800 border border-gray-700 p-6 shadow-lg shadow-cyan-400/10">
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <Label htmlFor="email" className="text-slate-300">Email address *</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${
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

          {/* Username Input */}
          <div>
            <Label htmlFor="username" className="text-slate-300">Username (optional)</Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${
                  errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
                placeholder="Choose a username"
                disabled={loading}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
            </div>
            {errors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              Optional. Can only contain letters, numbers, and underscores.
            </p>
          </div>

          {/* Password Input with Strength Indicator */}
          <div>
            <Label htmlFor="password" className="text-slate-300">Password *</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${
                  errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
                placeholder="Create a strong password"
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <PasswordStrengthIndicator password={formData.password} />
              </div>
            )}
            
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password *</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={`pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                }`}
                placeholder="Confirm your password"
                disabled={loading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Acceptance */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
              }
              disabled={loading}
              className="mt-1 border-gray-600 text-cyan-400"
            />
            <div className="text-sm">
              <Label htmlFor="acceptTerms" className="text-slate-300">
                I agree to the{' '}
                <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </Label>
              {errors.acceptTerms && (
                <p className="mt-1 text-red-400">{errors.acceptTerms}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-violet-400 hover:from-cyan-300 hover:to-violet-300 text-slate-900 font-medium py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </Card>
    </form>
  );

  const renderEmailVerification = () => (
    <div className="space-y-6">
      <Card className="bg-slate-800 border border-gray-700 p-6 shadow-lg shadow-cyan-400/10">
        <div className="text-center space-y-4">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-emerald-400" />
          </div>

          {/* Verification Instructions */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Check Your Email
            </h3>
            <p className="text-slate-400 mb-4">
              We've sent a verification link to{' '}
              <span className="text-cyan-400 font-medium">{registeredEmail}</span>
            </p>
            <p className="text-slate-400 text-sm">
              Click the link in your email to verify your account and receive your welcome credits.
            </p>
          </div>

          {/* Credit Reward Preview */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/20 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <span className="text-emerald-400 font-medium">500 Welcome Credits</span>
            </div>
            <p className="text-slate-400 text-sm">
              You'll receive 500 free credits after verifying your email. This is a one-time bonus to get you started.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              variant="outline"
              disabled={loading}
              className="w-full border-gray-600 text-slate-300 hover:bg-slate-700 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>
            
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-cyan-400 to-violet-400 hover:from-cyan-300 hover:to-violet-300 text-slate-900 font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-400/30"
            >
              Continue to Login
            </Button>
          </div>

          {/* Email Tips */}
          <div className="text-left text-xs text-slate-500 space-y-1 pt-4 border-t border-slate-700">
            <p>• Check your spam or junk folder if you don't see the email</p>
            <p>• The verification link will expire in 24 hours</p>
            <p>• Make sure you click the link from the same device/browser</p>
          </div>
        </div>
      </Card>
    </div>
  );

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
          
          {step === 'register' ? (
            <>
              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="mt-2 text-slate-400">
                Join PlayScenarioAI and start creating interactive scenarios
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white">Almost There!</h2>
              <p className="mt-2 text-slate-400">
                Please verify your email to complete registration
              </p>
            </>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Step Content */}
        {step === 'register' ? renderRegistrationForm() : renderEmailVerification()}

        {/* Login Link */}
        {step === 'register' && (
          <div className="text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* Value Proposition */}
        {step === 'register' && (
          <div className="text-center pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              Why Join PlayScenarioAI?
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">Create interactive AI scenarios</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                <span className="text-slate-300">Play community-created content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-slate-300">Get 500 free credits to start (one-time)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
