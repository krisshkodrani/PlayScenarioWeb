
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, BookOpen, Target } from 'lucide-react';

const NewUserDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <div className="mb-8">
          <Target className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to PlayScenarioAI! 🎯
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Get started by creating your first scenario or exploring what others have built. 
            Our AI-powered platform helps you practice real-world situations through interactive storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group"
                onClick={() => navigate('/create-scenario')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Your First Scenario</h3>
              <p className="text-slate-400 text-sm">
                Build an interactive scenario with AI characters and engaging storylines
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group"
                onClick={() => navigate('/browse')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-violet-400/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Browse Scenarios</h3>
              <p className="text-slate-400 text-sm">
                Explore community-created scenarios and start playing immediately
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-8 py-3 text-lg font-semibold"
            onClick={() => navigate('/create-scenario')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Scenario
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-3 text-lg border-slate-600 hover:border-slate-500 text-slate-300"
            onClick={() => navigate('/browse')}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Browse Library
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewUserDashboard;
