
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

const ResultsNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Results Not Found
            </h2>
            <p className="text-slate-400 mb-6">
              The game results you're looking for don't exist or may have been removed.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsNotFound;
