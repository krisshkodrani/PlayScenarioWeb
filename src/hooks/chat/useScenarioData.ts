
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scenario, ScenarioInstance } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

export const useScenarioData = (instanceId: string, scenarioId: string) => {
  const { user } = useAuth();
  const [instance, setInstance] = useState<ScenarioInstance | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);

  // Fetch scenario instance and validate ownership
  const fetchInstance = useCallback(async () => {
    if (!user || !instanceId) return;

    try {
      const { data: instanceData, error: instanceError } = await supabase
        .from('scenario_instances')
        .select('*')
        .eq('id', instanceId)
        .eq('user_id', user.id)
        .single();

      if (instanceError) throw instanceError;
      if (!instanceData) throw new Error('Instance not found or access denied');

      setInstance(instanceData);
    } catch (err) {
      console.error('Error fetching instance:', err);
      throw err;
    }
  }, [user, instanceId]);

  // Fetch scenario data
  const fetchScenario = useCallback(async () => {
    if (!scenarioId) return;

    try {
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('scenarios')
        .select('id, title, description, initial_scene_prompt, objectives, max_turns')
        .eq('id', scenarioId)
        .single();

      if (scenarioError) throw scenarioError;
      if (!scenarioData) throw new Error('Scenario not found');

      // Convert the scenario data to match our interface, ensuring objectives is an array
      const formattedScenario: Scenario = {
        id: scenarioData.id,
        title: scenarioData.title,
        description: scenarioData.description,
        initial_scene_prompt: scenarioData.initial_scene_prompt,
        objectives: Array.isArray(scenarioData.objectives) ? scenarioData.objectives : [],
        max_turns: scenarioData.max_turns
      };

      setScenario(formattedScenario);
    } catch (err) {
      console.error('Error fetching scenario:', err);
      throw err;
    }
  }, [scenarioId]);

  const updateInstance = useCallback((updates: Partial<ScenarioInstance>) => {
    setInstance(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return {
    instance,
    scenario,
    fetchInstance,
    fetchScenario,
    updateInstance
  };
};
