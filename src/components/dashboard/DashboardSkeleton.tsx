
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <Skeleton className="h-4 w-48 bg-slate-800" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 bg-slate-800" />
        ))}
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2">
          <Skeleton className="h-64 bg-slate-800" />
        </div>
        {/* Sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-32 bg-slate-800" />
          <Skeleton className="h-32 bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
