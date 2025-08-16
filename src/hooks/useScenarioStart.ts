
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Scenario } from '@/types/scenario';
import { useScenarioCosts } from './useScenarioCosts';
import config from '@/lib/config';

export interface ScenarioStartHook {
  startScenario: (scenario: Scenario) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export const useScenarioStart = (): ScenarioStartHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const startScenario = useCallback(async (scenario: Scenario): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting scenario:', scenario.id);

      // Calculate credits needed
      const characterCount = scenario.characters?.length || 1;
      const estimatedTurns = scenario.estimated_duration || 10;
      const creditsNeeded = estimatedTurns * characterCount;

      console.log(`Credits calculation: ${estimatedTurns} turns × ${characterCount} characters = ${creditsNeeded} credits`);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Check current credit balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to check credit balance');
      }

      if (!profile || profile.credits < creditsNeeded) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${creditsNeeded} credits to start this scenario. You currently have ${profile?.credits || 0} credits.`,
          variant: "destructive",
        });
        throw new Error(`Insufficient credits. Need ${creditsNeeded}, have ${profile?.credits || 0}`);
      }

      // Deduct credits using the existing function
      const { data: deductionSuccess, error: deductError } = await supabase.rpc('deduct_credits', {
        user_id: user.id,
        amount: creditsNeeded,
        reason: `Started scenario: ${scenario.title}`,
        instance_id: null
      });

      if (deductError || !deductionSuccess) {
        throw new Error('Failed to deduct credits. Please try again.');
      }

      // Separate AI characters and player character from scenario
      const aiCharacters = scenario.characters?.filter(char => char.role !== 'Player') || [];
      const playerCharacter = scenario.characters?.find(char => char.role === 'Player') || null;

      // Create scenario instance with embedded characters (cast to any to work around TypeScript issues)
      const { data: instance, error: instanceError } = await supabase
        .from('scenario_instances')
        .insert({
          user_id: user.id,
          scenario_id: scenario.id,
          max_turns: estimatedTurns,
          objectives_progress: scenario.objectives || [],
          status: 'playing',
          ai_characters: aiCharacters as any,
          player_character: playerCharacter as any
        } as any)
        .select()
        .single();

      if (instanceError || !instance) {
        // Try to refund credits if instance creation fails
        await supabase.rpc('add_credits', {
          user_id: user.id,
          amount: creditsNeeded,
          description: `Refund for failed scenario start: ${scenario.title}`
        });
        
        throw new Error('Failed to create scenario instance');
      }

      console.log('Scenario instance created:', instance.id);

      // Initialize scenario with proper initial messages via backend
      try {
        console.log('Calling scenario-start endpoint for initialization...');
        const initResponse = await fetch(`${config.api.baseUrl}/v1/chat/scenario-start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scenario_instance_id: instance.id
          })
        });

        if (!initResponse.ok) {
          const errorText = await initResponse.text();
          throw new Error(`Scenario initialization failed: ${errorText}`);
        }

        const initResult = await initResponse.json();
        console.log('Scenario initialization successful:', initResult);

        if (!initResult.success) {
          throw new Error('Scenario initialization failed: ' + JSON.stringify(initResult));
        }
      } catch (initError) {
        console.error('Scenario initialization failed:', initError);
        
        // Try to refund credits if initialization fails
        await supabase.rpc('add_credits', {
          user_id: user.id,
          amount: creditsNeeded,
          description: `Refund for failed scenario initialization: ${scenario.title}`
        });
        
        throw new Error(`Failed to initialize scenario: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
      }

      toast({
        title: "Scenario Started!",
        description: `${creditsNeeded} credits deducted. Good luck!`,
      });

      return instance.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start scenario';
      setError(errorMessage);
      console.error('Scenario start error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    startScenario,
    loading,
    error
  };
};
