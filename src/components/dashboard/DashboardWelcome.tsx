
import React from 'react';
import { User } from '@/types/dashboard';

interface DashboardWelcomeProps {
  user: User;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ user }) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getAccountAge = () => {
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    return `${Math.floor(diffDays / 30)} months`;
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        {getTimeBasedGreeting()}, {user.username || user.email.split('@')[0]}! 👋
      </h1>
      <p className="text-slate-400">
        Member for {getAccountAge()} • Ready to create some amazing scenarios?
      </p>
    </div>
  );
};

export default DashboardWelcome;
