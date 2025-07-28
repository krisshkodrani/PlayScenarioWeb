import React from 'react';
import { Brain, AlertTriangle, CheckCircle, Eye, Zap } from 'lucide-react';

interface EmotionIndicatorProps {
  emotion: string;
  size?: 'sm' | 'md';
}

const EmotionIndicator: React.FC<EmotionIndicatorProps> = ({ emotion, size = 'sm' }) => {
  const getEmotionConfig = (emotion: string) => {
    const lowerEmotion = emotion.toLowerCase();
    
    switch (lowerEmotion) {
      case 'cautious':
        return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' };
      case 'pragmatic':
        return { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' };
      case 'analytical':
        return { icon: Brain, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/30' };
      case 'curious':
        return { icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };
      case 'confident':
        return { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' };
      default:
        return { icon: Brain, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' };
    }
  };

  const { icon: Icon, color, bg, border } = getEmotionConfig(emotion);
  const sizeClasses = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const paddingClasses = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <div className={`${bg} ${border} border rounded-full ${paddingClasses} inline-flex items-center justify-center`}>
      <Icon className={`${sizeClasses} ${color}`} />
    </div>
  );
};

export default EmotionIndicator;