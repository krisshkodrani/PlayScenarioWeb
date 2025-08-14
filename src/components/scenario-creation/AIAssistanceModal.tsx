
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { ScenarioData } from '@/types/scenario';
import { useScenarioHelper } from '@/hooks/useScenarioHelper';

interface AIAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioData: ScenarioData;
  onApplyChanges: (updates: Partial<ScenarioData>) => void;
}

const AIAssistanceModal: React.FC<AIAssistanceModalProps> = ({
  isOpen,
  onClose,
  scenarioData,
  onApplyChanges
}) => {
  const [prompt, setPrompt] = useState('');
  const { createScenario, enhanceScenario } = useScenarioHelper();

  // Determine if we're creating or editing based on whether scenario has meaningful data
  const isEditMode = scenarioData.title?.trim() || scenarioData.description?.trim() || scenarioData.objectives?.length > 0;
  
  // Get appropriate mutation based on mode
  const mutation = isEditMode ? enhanceScenario : createScenario;

  const handleApplyAI = async () => {
    if (!prompt.trim()) return;
    
    try {
      let response;
      
      if (isEditMode) {
        // Enhance existing scenario
        response = await enhanceScenario.mutateAsync({
          userRequest: prompt,
          currentScenarioData: {
            title: scenarioData.title,
            description: scenarioData.description,
            category: scenarioData.category,
            difficulty: scenarioData.difficulty,
            estimated_duration: scenarioData.estimated_duration,
            objectives: scenarioData.objectives?.map(obj => ({
              id: obj.id,
              description: obj.description,
              priority: obj.priority || 'important'
            })),
            win_conditions: scenarioData.win_conditions,
            lose_conditions: scenarioData.lose_conditions,
            max_turns: scenarioData.max_turns,
            initial_scene_prompt: scenarioData.scenario_opening_message,
            characters: scenarioData.characters?.map(char => ({
              name: char.name,
              role: char.role || 'Character',
              personality: char.personality,
              expertise_keywords: char.expertise_keywords,
              background: char.background,
              appearance: char.appearance,
              goals: char.goals,
              fears: char.fears,
              notable_quotes: char.notable_quotes,
              is_player_character: char.is_player_character
            })),
            tags: scenarioData.tags
          }
        });
      } else {
        // Create new scenario
        response = await createScenario.mutateAsync({
          userRequest: prompt
        });
      }
      
      // Apply the AI response to the form
      onApplyChanges({
        title: response.title,
        description: response.description,
        category: response.category,
        difficulty: response.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'expert',
        estimated_duration: response.estimated_duration,
        objectives: response.objectives?.map(obj => ({
          id: obj.id,
          description: obj.description,
          priority: obj.priority
        })) || [],
        win_conditions: response.win_conditions,
        lose_conditions: response.lose_conditions,
        max_turns: response.max_turns,
        scenario_opening_message: response.initial_scene_prompt,
        characters: response.characters?.map(char => ({
          name: char.name,
          role: char.role,
          personality: char.personality,
          expertise_keywords: char.expertise_keywords,
          background: char.background,
          appearance: char.appearance,
          goals: char.goals,
          fears: char.fears,
          notable_quotes: char.notable_quotes,
          is_player_character: char.is_player_character
        })) || [],
        tags: response.tags,
        is_public: response.is_public
      });
      
      setPrompt('');
      onClose();
      
    } catch (error) {
      console.error('AI assistance failed:', error);
      // Error is handled by the mutation hook
    }
  };

  // Advanced context-aware suggestions based on current scenario state
  const getContextualSuggestions = () => {
    if (isEditMode) {
      const suggestions = [];
      
      // Analyze what's missing or could be improved
      if (!scenarioData.characters || scenarioData.characters.length === 0) {
        suggestions.push("Add diverse characters with different perspectives");
      } else if (scenarioData.characters.length < 3) {
        suggestions.push("Add more characters to create richer dynamics");
      }
      
      if (!scenarioData.win_conditions || scenarioData.win_conditions.length < 50) {
        suggestions.push("Strengthen win conditions with specific criteria");
      }
      
      if (!scenarioData.scenario_opening_message || scenarioData.scenario_opening_message.length < 100) {
        suggestions.push("Create a more immersive opening scene");
      }
      
      if (!scenarioData.objectives || scenarioData.objectives.length < 2) {
        suggestions.push("Add more varied objectives with different priorities");
      }
      
      if (scenarioData.max_turns && scenarioData.max_turns < 10) {
        suggestions.push("Add more complexity with extended gameplay");
      }
      
      // Default improvement suggestions if nothing specific needed
      if (suggestions.length === 0) {
        suggestions.push(
          "Add more realism and industry context",
          "Increase engagement with higher stakes",
          "Add time pressure and urgency",
          "Include ethical dilemmas and tough choices"
        );
      }
      
      return suggestions.slice(0, 5); // Limit to 5 suggestions
    } else {
      // Creation mode suggestions
      return [
        "Create a business crisis management scenario",
        "Design a healthcare decision-making challenge", 
        "Build a technical problem-solving simulation",
        "Develop a team collaboration exercise",
        "Make an educational training scenario"
      ];
    }
  };
  
  const suggestionPrompts = getContextualSuggestions();
  
  const isProcessing = mutation.isPending;
  const error = mutation.error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Scenario Assistant {isEditMode ? '(Enhancement Mode)' : '(Creation Mode)'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {isEditMode 
              ? 'Describe how you\'d like to improve or modify your scenario. AI will enhance your existing content.'
              : 'Describe the scenario you want to create. AI will generate complete scenario details for you.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="ai-prompt" className="text-white">
              What would you like to improve?
            </Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Make this scenario more fun and interactive' or 'Add more professional context'"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-violet-400 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-slate-400">{prompt.length}/500 characters</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-medium">AI assistance failed</p>
                <p className="text-red-300">{error.message}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-slate-300">Quick Suggestions:</Label>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs border-slate-600 text-slate-300 hover:text-white hover:border-violet-400"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">
                {isEditMode ? 'AI Will Enhance:' : 'AI Will Generate:'}
              </span>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Scenario title and description</li>
              <li>• Initial scene prompt and atmosphere</li>
              <li>• Detailed objectives with priorities</li>
              <li>• Win/lose conditions and turn limits</li>
              <li>• Character profiles and relationships</li>
              <li>• Professional tags and categorization</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:text-white"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyAI}
              disabled={!prompt.trim() || isProcessing}
              className="bg-violet-500 hover:bg-violet-600 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditMode ? 'Enhancing...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Apply AI Enhancement' : 'Create with AI'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistanceModal;
