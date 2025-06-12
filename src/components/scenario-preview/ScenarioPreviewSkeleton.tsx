
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ScenarioPreviewSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-4 w-48 bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Skeletons */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Skeleton */}
            <Card className="p-8 bg-slate-800 border-slate-700">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20 bg-slate-700" />
                  <Skeleton className="h-6 w-24 bg-slate-700" />
                </div>
                <Skeleton className="h-12 w-full bg-slate-700" />
                <div className="flex gap-6">
                  <Skeleton className="h-5 w-24 bg-slate-700" />
                  <Skeleton className="h-5 w-24 bg-slate-700" />
                  <Skeleton className="h-5 w-24 bg-slate-700" />
                </div>
                <Skeleton className="h-24 w-full bg-slate-700" />
              </div>
            </Card>

            {/* Objectives Skeleton */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-48 bg-slate-700" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-700/50 rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-full bg-slate-600" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-slate-600" />
                      <Skeleton className="h-4 w-full bg-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Characters Skeleton */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-56 bg-slate-700" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-5 bg-slate-700/50 rounded-lg">
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full bg-slate-600" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-24 bg-slate-600" />
                          <Skeleton className="h-4 w-16 bg-slate-600" />
                          <Skeleton className="h-16 w-full bg-slate-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Skeletons */}
          <div className="space-y-6">
            {/* Play Button Skeleton */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full bg-slate-700" />
                <Skeleton className="h-4 w-32 bg-slate-700" />
              </div>
            </Card>

            {/* Social Actions Skeleton */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-8 w-full bg-slate-700" />
                  <Skeleton className="h-8 w-full bg-slate-700" />
                  <Skeleton className="h-8 w-full bg-slate-700" />
                </div>
              </div>
            </Card>

            {/* Stats Skeleton */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-32 bg-slate-700" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-slate-700" />
                    <Skeleton className="h-4 w-16 bg-slate-700" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPreviewSkeleton;
