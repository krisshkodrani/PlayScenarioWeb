
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Scenario, Character } from '@/types/scenario';
import ScenarioHero from '@/components/scenario-preview/ScenarioHero';
import ObjectivesList from '@/components/scenario-preview/ObjectivesList';
import CharacterShowcase from '@/components/scenario-preview/CharacterShowcase';
import ActionSidebar from '@/components/scenario-preview/ActionSidebar';
import ScenarioPreviewSkeleton from '@/components/scenario-preview/ScenarioPreviewSkeleton';
import ScenarioNotFound from '@/components/scenario-preview/ScenarioNotFound';

interface ScenarioPreviewData {
  scenario: Scenario | null;
  characters: Character[];
  loading: boolean;
  error: string | null;
  userBookmarked: boolean;
  userLiked: boolean;
}

const ScenarioPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [data, setData] = useState<ScenarioPreviewData>({
    scenario: null,
    characters: [],
    loading: true,
    error: null,
    userBookmarked: false,
    userLiked: false
  });

  useEffect(() => {
    if (!id) return;
    
    fetchScenarioData(id);
  }, [id]);

  const fetchScenarioData = async (scenarioId: string) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // Mock API calls - replace with actual API endpoints when backend is ready
      console.log('Fetching scenario data for ID:', scenarioId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock scenario data
      const mockScenario: Scenario = {
        id: scenarioId,
        title: "Corporate Crisis Management",
        description: "Navigate a high-stakes corporate crisis as the newly appointed crisis management team. Work with key stakeholders to protect the company's reputation, address media scrutiny, and implement damage control strategies while managing internal conflicts and external pressures.",
        category: "business-training",
        difficulty: "Advanced",
        estimated_duration: 45,
        character_count: 4,
        characters: [],
        objectives: [
          {
            id: "1",
            title: "Assess the Crisis",
            description: "Evaluate the scope and impact of the crisis situation",
            priority: "critical"
          },
          {
            id: "2", 
            title: "Stakeholder Communication",
            description: "Coordinate with all key stakeholders and media",
            priority: "important"
          }
        ],
        created_at: "2024-01-15",
        created_by: "Dr. Sarah Chen",
        play_count: 1247,
        average_rating: 4.6,
        tags: ["crisis-management", "leadership", "communication", "business"],
        is_liked: false,
        is_bookmarked: false
      };

      const mockCharacters: Character[] = [
        {
          id: "char1",
          name: "Sarah Martinez",
          role: "CEO",
          personality: "Strategic leader under pressure, decisive but seeks input from trusted advisors",
          expertise_keywords: ["executive-leadership", "strategic-planning", "crisis-response"],
          avatar_color: "bg-cyan-500"
        },
        {
          id: "char2", 
          name: "David Kim",
          role: "Head of PR",
          personality: "Media-savvy communicator, calm under pressure, focuses on reputation management",
          expertise_keywords: ["public-relations", "media-strategy", "crisis-communication"],
          avatar_color: "bg-violet-500"
        },
        {
          id: "char3",
          name: "Alex Johnson", 
          role: "Legal Counsel",
          personality: "Detail-oriented, risk-averse, provides crucial legal perspective",
          expertise_keywords: ["corporate-law", "risk-assessment", "compliance"],
          avatar_color: "bg-amber-500"
        },
        {
          id: "char4",
          name: "Maya Patel",
          role: "Operations Director", 
          personality: "Practical problem-solver, focuses on operational continuity",
          expertise_keywords: ["operations-management", "logistics", "team-coordination"],
          avatar_color: "bg-emerald-500"
        }
      ];

      setData({
        scenario: mockScenario,
        characters: mockCharacters,
        loading: false,
        error: null,
        userBookmarked: mockScenario.is_bookmarked || false,
        userLiked: mockScenario.is_liked || false
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
      // TODO: Replace with actual API call when backend is ready
      console.log('Starting scenario play:', data.scenario.id);
      
      // Mock scenario instance creation
      const mockInstanceId = `instance_${Date.now()}`;
      
      toast({
        title: "Starting Scenario",
        description: "Initializing your scenario experience...",
      });
      
      // Navigate to core chat with instance ID
      navigate(`/core-chat?instance=${mockInstanceId}&scenario=${data.scenario.id}`);
    } catch (error) {
      toast({
        title: "Failed to Start",
        description: "Unable to start the scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async () => {
    if (!data.scenario) return;
    
    try {
      console.log('Toggling like for scenario:', data.scenario.id);
      
      // Optimistic UI update
      setData(prev => ({
        ...prev,
        userLiked: !prev.userLiked
      }));
      
      toast({
        title: data.userLiked ? "Removed Like" : "Liked Scenario",
        description: data.userLiked ? "Removed from your liked scenarios" : "Added to your liked scenarios",
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
      
      // Optimistic UI update
      setData(prev => ({
        ...prev,
        userBookmarked: !prev.userBookmarked
      }));
      
      toast({
        title: data.userBookmarked ? "Removed Bookmark" : "Bookmarked Scenario",
        description: data.userBookmarked ? "Removed from your bookmarks" : "Added to your bookmarks",
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <button 
              onClick={() => navigate('/browse')}
              className="hover:text-cyan-400 transition-colors"
            >
              Browse Scenarios
            </button>
            <span>/</span>
            <span className="text-white">{data.scenario.title}</span>
          </div>
        </nav>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <ScenarioHero scenario={data.scenario} />
            <ObjectivesList objectives={data.scenario.objectives} />
            <CharacterShowcase characters={data.characters} />
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <ActionSidebar
              scenario={data.scenario}
              userStats={{
                hasPlayed: false,
                isBookmarked: data.userBookmarked,
                hasLiked: data.userLiked,
                userCredits: 100 // Mock user credits
              }}
              onStartPlaying={handleStartPlaying}
              onBookmark={handleBookmark}
              onLike={handleLike}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPreview;
