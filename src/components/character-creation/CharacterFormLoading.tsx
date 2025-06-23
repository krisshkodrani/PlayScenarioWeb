
import React from 'react';

const CharacterFormLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-800 rounded w-64"></div>
          <div className="h-4 bg-slate-800 rounded w-96"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-64 bg-slate-800 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-slate-800 rounded-lg"></div>
              <div className="h-20 bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterFormLoading;
