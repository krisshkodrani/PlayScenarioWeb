import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  scenario_opening_message: '',
  is_public: false,
  difficulty: 'beginner',
  show_difficulty: true,
  characters: []
};

export const useScenarioCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenarioData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScenario, setIsLoadingScenario] = useState(false);
  
  // Prevent duplicate submissions
  const isSavingRef = useRef(false);
  
  // Get mode from URL parameters
  const editScenarioId = searchParams.get('edit');
  const duplicateScenarioId = searchParams.get('duplicate');
  const isEditMode = !!editScenarioId;
  const isDuplicateMode = !!duplicateScenarioId;

  // Debug logging for URL parameters
  console.log('🔍 URL Debug Info:', {
    currentURL: window.location.href,
    searchParams: searchParams.toString(),
    editScenarioId,
    duplicateScenarioId,
    isEditMode,
    isDuplicateMode
  });

  // Load existing scenario data when editing or duplicating
  useEffect(() => {
    const loadScenarioData = async () => {
      const scenarioId = editScenarioId || duplicateScenarioId;
      if (!scenarioId) return;

      setIsLoadingScenario(true);
      try {
        const scenario = await scenarioService.getScenarioById(scenarioId);
        if (scenario) {
          // Extract difficulty settings from scenario metadata
          const difficultyMeta = scenario.objectives?.find((obj: any) => obj._difficulty);
          
          const loadedData: ScenarioData = {
            title: isDuplicateMode ? `${scenario.title} (Copy)` : scenario.title,
            description: scenario.description,
            objectives: scenario.objectives.map(obj => ({
              id: obj.id ? parseInt(obj.id) : Date.now(),
              description: obj.description
            })),
            win_conditions: '', // These aren't in the Scenario type, keeping empty
            lose_conditions: '',
            max_turns: 20, // Default value
            scenario_opening_message: scenario.scenario_opening_message || '',
            is_public: isDuplicateMode ? false : scenario.is_public,
            difficulty: (difficultyMeta?._difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'expert',
            show_difficulty: difficultyMeta?._show_difficulty ?? true,
            characters: scenario.characters.map(char => ({
              name: char.name,
              personality: char.personality,
              expertise_keywords: char.expertise_keywords,
              is_player_character: char.role === 'Player' // Assuming role determines if player character
            }))
          };
          setScenarioData(loadedData);
          console.log('Loaded scenario data for', isEditMode ? 'editing' : 'duplicating', ':', loadedData);
        }
      } catch (error) {
        console.error('Error loading scenario:', error);
        toast({
          title: "Error Loading Scenario",
          description: "Failed to load scenario data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingScenario(false);
      }
    };

    loadScenarioData();
  }, [editScenarioId, duplicateScenarioId, isEditMode, isDuplicateMode, toast]);

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
    
    // Player character validation (now optional with anonymous option)
    if (playerCharacters.length > 1) {
      errors.push('Maximum one player character is allowed');
    }
    
    // AI character validation (required)
    if (aiCharacters.length === 0) {
      errors.push('At least one AI character is required');
    }
    
    if (aiCharacters.length > 5) {
      errors.push('Maximum 5 AI characters are allowed');
    }
    
    // Total character validation (adjusted for optional player character)
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
        name: 'scenario_opening_message',
        valid: scenarioData.scenario_opening_message.trim().length >= 10
      },
      {
        name: 'objectives',
        valid: scenarioData.objectives.length > 0
      },
      {
        name: 'characters',
        valid: validateCharacters(scenarioData.characters).length === 0
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
      if (scenarioData.scenario_opening_message.trim().length < 10) {
        errors.push('Scenario opening message must be at least 10 characters');
      }
    if (scenarioData.objectives.length === 0) {
      errors.push('At least one objective is required');
    }
    // Characters validation updated - we only require AI characters
    const aiCharacters = scenarioData.characters.filter(char => !char.is_player_character);
    if (aiCharacters.length === 0) {
      errors.push('At least one AI character is required');
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
    // Prevent duplicate submissions
    if (isSavingRef.current) {
      console.log('Save already in progress, skipping duplicate request');
      return false;
    }
    
    isSavingRef.current = true;
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
      
      let result;
      if (isEditMode && editScenarioId) {
        // Update existing scenario
        result = await scenarioService.updateScenario(editScenarioId, dataToSave);
      } else {
        // Create new scenario (for new creation or duplication)
        result = await scenarioService.createScenario(dataToSave);
      }
      
      if (result) {
        // Update local state to reflect the saved changes, including publication status
        setScenarioData(prev => ({
          ...prev,
          is_public: publish
        }));

        toast({
          title: isEditMode ? "Scenario Updated" : (publish ? "Scenario Published" : "Scenario Saved"),
          description: isEditMode 
            ? "Your scenario has been updated successfully."
            : (publish 
              ? "Your scenario is now available in the public library."
              : "Your scenario has been saved as a draft."),
        });
        
        // Only navigate away when publishing new scenarios
        if (!isEditMode && publish) {
          navigate('/my-scenarios');
        }
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Save error:', error);
      
      // Handle specific error cases
      if (error?.code === "23505" && error?.message?.includes("duplicate_title")) {
        // Check if this is a case where user should be editing instead of creating
        if (!isEditMode) {
          toast({
            title: "Scenario Already Exists",
            description: "You already have a scenario with this title. Please either: 1) Change the title to create a new scenario, or 2) Go to 'My Scenarios' and click 'Edit' on the existing scenario.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Duplicate Title",
            description: "You already have a scenario with this title. Please choose a different title.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Save Failed",
          description: "There was an error saving your scenario. Please try again.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsLoading(false);
      isSavingRef.current = false;
    }
  }, [scenarioData, validateScenario, toast, navigate, isEditMode, editScenarioId]);

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
    isLoading,
    isLoadingScenario,
    isEditMode,
    isDuplicateMode,
    editScenarioId,
    duplicateScenarioId
  };
};
