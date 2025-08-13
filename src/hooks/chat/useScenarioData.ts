
import { useState, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scenario, ScenarioInstance } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

export const useScenarioData = (instanceId: string, scenarioId: string) => {
  const { user } = useAuth();
  const [instance, setInstance] = useState<ScenarioInstance | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);

  // Fetch scenario instance and validate ownership
  const fetchInstance = useCallback(async () => {
    console.log('🔍 fetchInstance: Starting', { user: !!user, userId: user?.id, instanceId });
    
    if (!user || !instanceId) {
      console.log('❌ fetchInstance: Missing user or instanceId');
      return;
    }

    try {
      console.log('📡 fetchInstance: Making Supabase query');
      
      const { data: instanceData, error: instanceError } = await supabase
        .from('scenario_instances')
        .select('*')
        .eq('id', instanceId)
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('📡 fetchInstance: Query result', { 
        data: !!instanceData, 
        error: instanceError?.message,
        instanceData: instanceData 
      });

      if (instanceError) {
        console.error('❌ fetchInstance: Supabase error:', instanceError);
        throw instanceError;
      }
      if (!instanceData) {
        console.error('❌ fetchInstance: No data returned');
        throw new Error('Instance not found or access denied');
      }

      console.log('✅ fetchInstance: Setting instance data', instanceData);
      setInstance(instanceData);
      return instanceData;
    } catch (err) {
      console.error('❌ fetchInstance: Error:', err);
      throw err;
    }
  }, [instanceId]);

  // Fetch scenario data
  const fetchScenario = useCallback(async () => {
    console.log('🔍 fetchScenario: Starting', { scenarioId });
    
    if (!scenarioId) {
      console.log('❌ fetchScenario: Missing scenarioId');
      return;
    }

    try {
      console.log('📡 fetchScenario: Making Supabase query');
      
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('scenarios')
        .select('id, title, description, initial_scene_prompt, objectives, max_turns')
        .eq('id', scenarioId)
        .maybeSingle();

      console.log('📡 fetchScenario: Query result', { 
        data: !!scenarioData, 
        error: scenarioError?.message,
        scenarioData: scenarioData 
      });

      if (scenarioError) {
        console.error('❌ fetchScenario: Supabase error:', scenarioError);
        throw scenarioError;
      }
      if (!scenarioData) {
        console.error('❌ fetchScenario: No data returned');
        throw new Error('Scenario not found');
      }

      // Convert the scenario data to match our interface, ensuring objectives is an array
      const formattedScenario: Scenario = {
        id: scenarioData.id,
        title: scenarioData.title,
        description: scenarioData.description,
        initial_scene_prompt: scenarioData.initial_scene_prompt,
        objectives: Array.isArray(scenarioData.objectives) ? scenarioData.objectives : [],
        max_turns: scenarioData.max_turns
      };

      console.log('✅ fetchScenario: Setting scenario data', formattedScenario);
      setScenario(formattedScenario);
      return formattedScenario;
    } catch (err) {
      console.error('❌ fetchScenario: Error:', err);
      throw err;
    }
  }, [scenarioId]);

  const updateInstance = useCallback((updates: Partial<ScenarioInstance>) => {
    setInstance(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Merge scenario objectives with instance progress
  const objectivesWithProgress = useMemo(() => {
    if (!scenario || !instance) return [];
    
    const staticObjectives = scenario.objectives || [];
    const progressData = instance.objectives_progress || {};
    
    return staticObjectives.map((objective: any, index: number) => {
      const objectiveKey = `objective_${objective.id || index + 1}`;
      const progress = progressData[objectiveKey] || {};
      
      return {
        id: objective.id || `obj_${index + 1}`,
        title: objective.description || objective.title || `Objective ${index + 1}`,
        description: objective.description || objective.title || '',
        completion_percentage: progress.completion_percentage || 0,
        status: progress.status || 'active',
        priority: objective.priority || 'normal',
        hints: progress.hints || ['Continue engaging with the scenario to progress'],
        progress_notes: progress.progress_notes || 'No progress yet'
      };
    });
  }, [scenario, instance]);

  return {
    instance,
    scenario,
    objectivesWithProgress,
    fetchInstance,
    fetchScenario,
    updateInstance
  };
};
