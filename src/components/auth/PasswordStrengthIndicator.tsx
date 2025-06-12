
import React from 'react';

interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  const feedback: string[] = [];

  if (!checks.length) feedback.push('At least 8 characters');
  if (!checks.lowercase) feedback.push('One lowercase letter');
  if (!checks.uppercase) feedback.push('One uppercase letter');
  if (!checks.number) feedback.push('One number');
  if (!checks.special) feedback.push('One special character');

  return {
    score,
    feedback,
    isValid: score >= 3 && checks.length
  };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  
  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-400';
    if (score <= 2) return 'bg-amber-400';
    if (score <= 3) return 'bg-yellow-400';
    return 'bg-emerald-400';
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return 'Weak';
    if (score <= 2) return 'Fair';
    if (score <= 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
              level <= strength.score 
                ? getStrengthColor(strength.score)
                : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
      
      {/* Strength Label and Requirements */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium transition-colors duration-200 ${
          strength.score <= 1 ? 'text-red-400' :
          strength.score <= 2 ? 'text-amber-400' :
          strength.score <= 3 ? 'text-yellow-400' :
          'text-emerald-400'
        }`}>
          {getStrengthText(strength.score)}
        </span>
        
        {strength.feedback.length > 0 && (
          <div className="text-xs text-slate-400">
            Missing: {strength.feedback.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export { calculatePasswordStrength };
