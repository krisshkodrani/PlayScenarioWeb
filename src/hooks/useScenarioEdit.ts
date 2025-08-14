import { useState, useCallback, useEffect, useRef } from 'react';
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

export const useScenarioEdit = (scenarioId: string, isDuplicate: boolean = false) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenarioData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScenario, setIsLoadingScenario] = useState(true);
  const isSavingRef = useRef(false);

  // Load existing scenario data
  useEffect(() => {
    const loadScenario = async () => {
      if (!scenarioId) {
        setIsLoadingScenario(false);
        return;
      }

      try {
        setIsLoadingScenario(true);
        const scenario = await scenarioService.getScenarioById(scenarioId);
        
        if (scenario) {
          const loadedData: ScenarioData = {
            title: isDuplicate ? `Copy of ${scenario.title}` : scenario.title,
            description: scenario.description,
            objectives: scenario.objectives.map(obj => ({
              id: typeof obj.id === 'string' ? parseInt(obj.id, 10) : obj.id,
              description: obj.description || obj.title || ''
            })),
            win_conditions: scenario.win_conditions || '',
            lose_conditions: scenario.lose_conditions || '',
            max_turns: scenario.max_turns || 10,
            scenario_opening_message: scenario.scenario_opening_message || '',
            is_public: isDuplicate ? false : scenario.is_public,
            difficulty: scenario.difficulty?.toLowerCase() as any || 'beginner',
            show_difficulty: true,
            characters: scenario.characters.map(char => ({
              id: isDuplicate ? undefined : char.id,
              name: char.name,
              personality: char.personality,
              expertise_keywords: char.expertise_keywords,
              is_player_character: char.role === 'player' || false,
              role: char.role
            }))
          };
          
          setScenarioData(loadedData);
        } else {
          toast({
            title: "Scenario Not Found",
            description: "The scenario you're trying to edit could not be found.",
            variant: "destructive",
          });
          navigate('/my-scenarios');
        }
      } catch (error) {
        console.error('Error loading scenario:', error);
        toast({
          title: "Loading Error",
          description: "Failed to load scenario data. Please try again.",
          variant: "destructive",
        });
        navigate('/my-scenarios');
      } finally {
        setIsLoadingScenario(false);
      }
    };

    loadScenario();
  }, [scenarioId, isDuplicate, toast, navigate]);

  const updateScenarioData = useCallback((updates: Partial<ScenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...updates }));
  }, []);

  const validateCharacters = useCallback((characters: any[]) => {
    const playerCharacters = characters.filter(c => c.is_player_character);
    const aiCharacters = characters.filter(c => !c.is_player_character);
    
    const errors = [];
    if (playerCharacters.length === 0) {
      errors.push('At least one player character is required');
    }
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

    if (scenarioData.title && scenarioData.description) completedSections++;
    if (scenarioData.objectives.length > 0) completedSections++;
    if (scenarioData.characters.length > 0) {
      const characterErrors = validateCharacters(scenarioData.characters);
      if (characterErrors.length === 0) completedSections++;
    }
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

      if (isDuplicate) {
        // Create new scenario (duplicate)
        await scenarioService.createScenario(scenarioToSave);
        toast({
          title: publish ? "Scenario Duplicated & Published!" : "Scenario Duplicated!",
          description: publish 
            ? "Your duplicated scenario is now public and ready to be played by others."
            : "Your scenario has been duplicated and saved as a draft.",
        });
      } else {
        // Update existing scenario
        await scenarioService.updateScenario(scenarioId, scenarioToSave);
        toast({
          title: publish ? "Scenario Updated & Published!" : "Scenario Updated!",
          description: publish 
            ? "Your scenario changes have been saved and it's now public."
            : "Your scenario changes have been saved.",
        });
      }

      navigate('/my-scenarios');
    } catch (error: any) {
      console.error('Save error:', error);
      
      if (error?.message?.includes("duplicate_title") || error?.message?.includes("unique_scenario_title_per_creator")) {
        toast({
          title: "Duplicate Title",
          description: "You already have another scenario with this title. Please choose a different title.",
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
  }, [scenarioData, validateScenario, toast, navigate, scenarioId, isDuplicate]);

  const handlePublish = useCallback(() => handleSave(true), [handleSave]);

  return {
    scenarioData,
    updateScenarioData,
    calculateProgress,
    handleSave,
    handlePublish,
    isLoading,
    isLoadingScenario
  };
};