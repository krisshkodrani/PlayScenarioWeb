
import { useMemo } from 'react';
import { Scenario } from '@/types/scenario';

export interface ScenarioCostCalculation {
  totalCost: number;
  characterCount: number;
  estimatedTurns: number;
  costBreakdown: {
    perTurn: number;
    totalTurns: number;
    characters: number;
  };
}

export const useScenarioCosts = (scenario: Scenario | null): ScenarioCostCalculation => {
  return useMemo(() => {
    if (!scenario) {
      return {
        totalCost: 0,
        characterCount: 0,
        estimatedTurns: 0,
        costBreakdown: { perTurn: 0, totalTurns: 0, characters: 0 }
      };
    }

    const characterCount = scenario.characters?.length || 1;
    const estimatedTurns = scenario.max_turns || scenario.estimated_duration || 10;
    
    // Cost formula: turns × characters
    const totalCost = estimatedTurns * characterCount;

    return {
      totalCost,
      characterCount,
      estimatedTurns,
      costBreakdown: {
        perTurn: characterCount,
        totalTurns: estimatedTurns,
        characters: characterCount
      }
    };
  }, [scenario]);
};

export default useScenarioCosts;
