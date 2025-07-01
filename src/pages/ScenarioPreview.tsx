import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Scenario, Character } from '@/types/scenario';
import { scenarioService } from '@/services/scenarioService';
import { useScenarioStart } from '@/hooks/useScenarioStart';
import { useScenarioCosts } from '@/hooks/useScenarioCosts';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioHero from '@/components/scenario-preview/ScenarioHero';
import ObjectivesList from '@/components/scenario-preview/ObjectivesList';
import CharacterShowcase from '@/components/scenario-preview/CharacterShowcase';
import ActionSidebar from '@/components/scenario-preview/ActionSidebar';
import ScenarioPreviewSkeleton from '@/components/scenario-preview/ScenarioPreviewSkeleton';
import ScenarioNotFound from '@/components/scenario-preview/ScenarioNotFound';
import CreditCostDisplay from '@/components/credits/CreditCostDisplay';
import { supabase } from '@/integrations/supabase/client';

interface ScenarioPreviewData {
  scenario: Scenario | null;
  loading: boolean;
  error: string | null;
  userBookmarked: boolean;
  userLiked: boolean;
  userCredits: number;
}

const ScenarioPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startScenario, loading: startLoading } = useScenarioStart();
  
  const [data, setData] = useState<ScenarioPreviewData>({
    scenario: null,
    loading: true,
    error: null,
    userBookmarked: false,
    userLiked: false,
    userCredits: 0
  });

  const costCalculation = useScenarioCosts(data.scenario);

  useEffect(() => {
    if (!id) return;
    
    fetchScenarioData(id);
  }, [id]);

  const fetchScenarioData = async (scenarioId: string) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('Fetching scenario data for ID:', scenarioId);
      
      const scenario = await scenarioService.getScenarioById(scenarioId);
      
      if (!scenario) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Scenario not found'
        }));
        return;
      }

      // Get user's credit balance
      const { data: { user } } = await supabase.auth.getUser();
      let userCredits = 0;
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();
        
        userCredits = profile?.credits || 0;
      }

      setData({
        scenario,
        loading: false,
        error: null,
        userBookmarked: scenario.is_bookmarked || false,
        userLiked: scenario.is_liked || false,
        userCredits
      });

    } catch (error) {
      console.error('Error fetching scenario data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load scenario. Please try again.'
      }));
    }
  };

  const handleStartPlaying = async () => {
    if (!data.scenario) return;
    
    try {
      console.log('Starting scenario play:', data.scenario.id);
      
      const instanceId = await startScenario(data.scenario);
      
      if (instanceId) {
        // Navigate to core chat with instance ID
        navigate(`/core-chat?instance=${instanceId}&scenario=${data.scenario.id}`);
      }
    } catch (error) {
      // Error handling is done in useScenarioStart hook
      console.error('Failed to start scenario:', error);
    }
  };

  const handleLike = async () => {
    if (!data.scenario) return;
    
    try {
      console.log('Toggling like for scenario:', data.scenario.id);
      
      const newLikedState = !data.userLiked;
      
      // Optimistic UI update
      setData(prev => ({
        ...prev,
        userLiked: newLikedState
      }));
      
      await scenarioService.toggleScenarioLike(data.scenario.id, newLikedState);
      
      toast({
        title: newLikedState ? "Liked Scenario" : "Removed Like",
        description: newLikedState ? "Added to your liked scenarios" : "Removed from your liked scenarios",
      });
    } catch (error) {
      // Revert optimistic update on error
      setData(prev => ({
        ...prev,
        userLiked: !prev.userLiked
      }));
      
      toast({
        title: "Action Failed",
        description: "Unable to update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async () => {
    if (!data.scenario) return;
    
    try {
      console.log('Toggling bookmark for scenario:', data.scenario.id);
      
      const newBookmarkedState = !data.userBookmarked;
      
      // Optimistic UI update
      setData(prev => ({
        ...prev,
        userBookmarked: newBookmarkedState
      }));
      
      await scenarioService.toggleScenarioBookmark(data.scenario.id, newBookmarkedState);
      
      toast({
        title: newBookmarkedState ? "Bookmarked Scenario" : "Removed Bookmark",
        description: newBookmarkedState ? "Added to your bookmarks" : "Removed from your bookmarks",
      });
    } catch (error) {
      // Revert optimistic update on error
      setData(prev => ({
        ...prev,
        userBookmarked: !prev.userBookmarked
      }));
      
      toast({
        title: "Action Failed",
        description: "Unable to update bookmark status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (data.loading) {
    return <ScenarioPreviewSkeleton />;
  }

  if (data.error || !data.scenario) {
    return <ScenarioNotFound scenarioId={id || ''} error={data.error} />;
  }

  const customBreadcrumbs = [
    { label: 'Browse Scenarios', href: '/browse' },
    { label: data.scenario.title }
  ];

  const hasEnoughCredits = data.userCredits >= costCalculation.totalCost;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={data.scenario.title}
          subtitle={`${data.scenario.category} • ${data.scenario.difficulty} • ${data.scenario.estimated_duration} minutes`}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <ScenarioHero scenario={data.scenario} />
            
            {/* Credit Cost Display */}
            <CreditCostDisplay
              costCalculation={costCalculation}
              userCredits={data.userCredits}
            />
            
            <ObjectivesList objectives={data.scenario.objectives} />
            <CharacterShowcase characters={data.scenario.characters} />
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <ActionSidebar
              scenario={data.scenario}
              userStats={{
                hasPlayed: false,
                isBookmarked: data.userBookmarked,
                hasLiked: data.userLiked,
                userCredits: data.userCredits
              }}
              onStartPlaying={handleStartPlaying}
              onBookmark={handleBookmark}
              onLike={handleLike}
              startLoading={startLoading}
              hasEnoughCredits={hasEnoughCredits}
              requiredCredits={costCalculation.totalCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPreview;
