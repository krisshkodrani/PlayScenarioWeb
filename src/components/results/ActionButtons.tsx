
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RotateCcw, Search, Share2, Home, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  scenarioId: string;
  instanceId: string;
  status: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  scenarioId, 
  instanceId, 
  status 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: 'Check out my game results!',
      text: `I just completed a scenario on PlayScenarioAI and ${status === 'won' ? 'won' : 'completed'} it!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Results link copied to clipboard",
        });
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      <Button
        onClick={() => navigate(`/scenario/${scenarioId}`)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Play Again
      </Button>

      <Button
        onClick={() => navigate('/browse')}
        variant="outline"
        className="border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        <Search className="w-4 h-4 mr-2" />
        Browse More Scenarios
      </Button>

      <Button
        onClick={handleShare}
        variant="outline" 
        className="border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share Results
      </Button>

      <Button
        onClick={() => navigate('/dashboard')}
        variant="outline"
        className="border-slate-600 text-slate-300 hover:bg-slate-700"
      >
        <Home className="w-4 h-4 mr-2" />
        Dashboard
      </Button>

      <Button
        onClick={() => window.open('https://discord.gg/ccuKkz5t', '_blank')}
        variant="outline"
        className="border-violet-400 text-violet-400 hover:bg-violet-400 hover:text-slate-900"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Discord
      </Button>
    </div>
  );
};

export default ActionButtons;
