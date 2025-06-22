
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
    setScenarioData(prev => ({ ...prev, ...updates }));
  }, []);

  const calculateProgress = useCallback(() => {
    const requiredFields = [
      scenarioData.title.trim(),
      scenarioData.description.trim(),
      scenarioData.initial_scene_prompt.trim(),
      scenarioData.objectives.length > 0,
      scenarioData.characters.length > 0
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  }, [scenarioData]);

  const validateScenario = useCallback(() => {
    const errors: string[] = [];
    
    if (!scenarioData.title.trim()) errors.push('Title is required');
    if (!scenarioData.description.trim()) errors.push('Description is required');
    if (!scenarioData.initial_scene_prompt.trim()) errors.push('Initial scene prompt is required');
    if (scenarioData.objectives.length === 0) errors.push('At least one objective is required');
    if (scenarioData.characters.length === 0) errors.push('At least one character is required');
    if (scenarioData.max_turns < 5) errors.push('Minimum 5 turns required');
    
    return errors;
  }, [scenarioData]);

  const handleSave = useCallback(async (publish = false) => {
    setIsLoading(true);
    
    try {
      const errors = validateScenario();
      if (errors.length > 0 && publish) {
        toast({
          title: "Validation Failed",
          description: errors.join(', '),
          variant: "destructive",
        });
        return false;
      }

      const dataToSave = { ...scenarioData, is_public: publish };
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
    handleSave,
    handlePublish,
    resetScenario,
    isLoading
  };
};
