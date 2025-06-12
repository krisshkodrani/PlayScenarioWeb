
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Search } from 'lucide-react';

interface ScenarioNotFoundProps {
  scenarioId: string;
  error?: string | null;
}

const ScenarioNotFound: React.FC<ScenarioNotFoundProps> = ({ scenarioId, error }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-lg mx-auto p-8 bg-slate-800 border-slate-700 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Scenario Not Found</h1>
              <p className="text-slate-400">
                {error || `The scenario with ID "${scenarioId}" could not be found.`}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                This scenario may have been removed, made private, or the link may be incorrect.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/browse')}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-900"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Scenarios
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-slate-600 text-slate-300 hover:border-slate-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioNotFound;
