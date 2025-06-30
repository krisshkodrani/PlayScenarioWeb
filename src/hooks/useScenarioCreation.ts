
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ScenarioData } from '@/types/scenario';
import { scenarioService } from '@/services/scenarioService';

const defaultScenarioData: ScenarioData = {
  title: '',
  description: '',
  objectives: [],
  win_conditions: '',
  lose_conditions: '',
  max_turns: 20,
  initial_scene_prompt: '',
  is_public: false,
  characters: []
};

export const useScenarioCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenarioData);
  const [isLoading, setIsLoading] = useState(false);

  const updateScenarioData = useCallback((updates: Partial<ScenarioData>) => {
    setScenarioData(prev => {
      const updated = { ...prev, ...updates };
      console.log('Scenario data updated:', updated);
      return updated;
    });
  }, []);

  const validateCharacters = useCallback((characters: any[]) => {
    const playerCharacters = characters.filter(char => char.is_player_character);
    const aiCharacters = characters.filter(char => !char.is_player_character);
    
    const errors: string[] = [];
    
    if (playerCharacters.length === 0) {
      errors.push('At least one player character is required');
    }
    
    if (playerCharacters.length > 1) {
      errors.push('Maximum one player character is allowed');
    }
    
    if (aiCharacters.length === 0) {
      errors.push('At least one AI character is required');
    }
    
    if (aiCharacters.length > 5) {
      errors.push('Maximum 5 AI characters are allowed');
    }
    
    if (characters.length > 6) {
      errors.push('Maximum 6 characters total (1 player + 5 AI)');
    }
    
    return errors;
  }, []);

  const calculateProgress = useCallback(() => {
    console.log('Calculating progress for:', scenarioData);
    
    // Define required fields with better validation
    const requirements = [
      {
        name: 'title',
        valid: scenarioData.title.trim().length >= 3
      },
      {
        name: 'description', 
        valid: scenarioData.description.trim().length >= 10
      },
      {
        name: 'initial_scene_prompt',
        valid: scenarioData.initial_scene_prompt.trim().length >= 10
      },
      {
        name: 'objectives',
        valid: scenarioData.objectives.length > 0
      },
      {
        name: 'characters',
        valid: scenarioData.characters.length > 0 && validateCharacters(scenarioData.characters).length === 0
      }
    ];
    
    const completedRequirements = requirements.filter(req => req.valid);
    const progress = (completedRequirements.length / requirements.length) * 100;
    
    console.log('Progress calculation:', {
      requirements: requirements.map(r => ({ name: r.name, valid: r.valid })),
      completed: completedRequirements.length,
      total: requirements.length,
      progress: Math.round(progress)
    });
    
    return progress;
  }, [scenarioData, validateCharacters]);

  const validateScenario = useCallback(() => {
    const errors: string[] = [];
    
    if (scenarioData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    if (scenarioData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    if (scenarioData.initial_scene_prompt.trim().length < 10) {
      errors.push('Initial scene prompt must be at least 10 characters');
    }
    if (scenarioData.objectives.length === 0) {
      errors.push('At least one objective is required');
    }
    if (scenarioData.characters.length === 0) {
      errors.push('At least one character is required');
    }
    
    // Add character validation
    const characterErrors = validateCharacters(scenarioData.characters);
    errors.push(...characterErrors);
    
    if (scenarioData.max_turns < 5) {
      errors.push('Minimum 5 turns required');
    }
    
    return errors;
  }, [scenarioData, validateCharacters]);

  const handleSave = useCallback(async (publish = false) => {
    setIsLoading(true);
    
    try {
      console.log('Saving scenario with data:', scenarioData);
      console.log('Characters to save:', scenarioData.characters);
      
      // For draft saves, don't validate everything - allow partial saves
      if (publish) {
        const errors = validateScenario();
        if (errors.length > 0) {
          toast({
            title: "Validation Failed",
            description: errors.join(', '),
            variant: "destructive",
          });
          return false;
        }
      } else {
        // For drafts, only check for basic requirements
        if (!scenarioData.title.trim()) {
          toast({
            title: "Title Required",
            description: "Please provide a title for your scenario before saving.",
            variant: "destructive",
          });
          return false;
        }
      }

      const dataToSave = { 
        ...scenarioData, 
        is_public: publish,
        // Ensure characters are included in the save data
        characters: scenarioData.characters || []
      };
      
      console.log('Final data being saved:', dataToSave);
      
      const result = await scenarioService.createScenario(dataToSave);
      
      if (result) {
        toast({
          title: publish ? "Scenario Published" : "Scenario Saved",
          description: publish 
            ? "Your scenario is now available in the public library."
            : "Your scenario has been saved as a draft.",
        });
        
        navigate('/my-scenarios');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your scenario. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [scenarioData, validateScenario, toast, navigate]);

  const handlePublish = useCallback(() => handleSave(true), [handleSave]);

  const resetScenario = useCallback(() => {
    setScenarioData(defaultScenarioData);
  }, []);

  return {
    scenarioData,
    updateScenarioData,
    calculateProgress,
    validateScenario,
    validateCharacters,
    handleSave,
    handlePublish,
    resetScenario,
    isLoading
  };
};
