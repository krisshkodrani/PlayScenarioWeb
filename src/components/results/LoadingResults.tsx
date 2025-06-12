
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingResults: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-20">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Analyzing Results...
            </h2>
            <p className="text-slate-400">
              Please wait while we compile your performance data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingResults;
