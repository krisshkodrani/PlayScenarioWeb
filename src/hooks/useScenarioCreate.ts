import { useState, useCallback, useRef } from 'react';
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
  max_turns: 10,
  scenario_opening_message: '',
  is_public: false,
  difficulty: 'beginner',
  show_difficulty: true,
  characters: []
};

export const useScenarioCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenarioData);
  const [isLoading, setIsLoading] = useState(false);
  const isSavingRef = useRef(false);

  const updateScenarioData = useCallback((updates: Partial<ScenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCharacters = useCallback((characters: any[]) => {
    const playerCharacters = characters.filter(c => c.is_player_character);
    const aiCharacters = characters.filter(c => !c.is_player_character);
    
    const errors = [];
    // Anonymous players are allowed - no player character required
    if (playerCharacters.length > 1) {
      errors.push('Only one player character is allowed');
    }
    if (aiCharacters.length === 0) {
      errors.push('At least one AI character is required');
    }
    if (characters.length > 6) {
      errors.push('Maximum 6 characters allowed');
    }
    
    return errors;
  }, []);

  const calculateProgress = useCallback(() => {
    let completedSections = 0;
    const totalSections = 4;

    // Basic info
    if (scenarioData.title && scenarioData.description) completedSections++;
    
    // Objectives
    if (scenarioData.objectives.length > 0) completedSections++;
    
    // Characters
    if (scenarioData.characters.length > 0) {
      const characterErrors = validateCharacters(scenarioData.characters);
      if (characterErrors.length === 0) completedSections++;
    }
    
    // Settings
    if (scenarioData.win_conditions && scenarioData.lose_conditions) completedSections++;

    return Math.round((completedSections / totalSections) * 100);
  }, [scenarioData, validateCharacters]);

  const validateScenario = useCallback(() => {
    const errors = [];

    if (!scenarioData.title?.trim()) {
      errors.push('Title is required');
    }

    if (!scenarioData.description?.trim()) {
      errors.push('Description is required');
    }

    if (scenarioData.objectives.length === 0) {
      errors.push('At least one objective is required');
    }

    if (!scenarioData.win_conditions?.trim()) {
      errors.push('Win conditions are required');
    }

    if (!scenarioData.lose_conditions?.trim()) {
      errors.push('Lose conditions are required');
    }

    if (scenarioData.characters.length === 0) {
      errors.push('At least one character is required');
    } else {
      const characterErrors = validateCharacters(scenarioData.characters);
      errors.push(...characterErrors);
    }

    return errors;
  }, [scenarioData, validateCharacters]);

  const handleSave = useCallback(async (publish = false) => {
    if (isSavingRef.current) return;

    const validationErrors = validateScenario();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors[0],
        variant: "destructive",
      });
      return;
    }

    try {
      isSavingRef.current = true;
      setIsLoading(true);

      const scenarioToSave = {
        ...scenarioData,
        is_public: publish
      };

      console.log('Creating scenario:', scenarioToSave);
      const result = await scenarioService.createScenario(scenarioToSave);
      
      toast({
        title: publish ? "Scenario Published!" : "Scenario Saved!",
        description: publish 
          ? "Your scenario is now public and ready to be played by others."
          : "Your scenario has been saved as a draft.",
      });

      navigate('/my-scenarios');
    } catch (error: any) {
      console.error('Save error:', error);
      
      if (error?.message?.includes("duplicate_title") || error?.message?.includes("unique_scenario_title_per_creator")) {
        toast({
          title: "Duplicate Title",
          description: "You already have a scenario with this title. Please choose a different title.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Save Failed",
          description: error?.message || "Unable to save the scenario. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      isSavingRef.current = false;
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
    handleSave,
    handlePublish,
    isLoading,
    resetScenario
  };
};