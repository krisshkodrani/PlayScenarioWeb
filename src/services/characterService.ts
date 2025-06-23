
import { characterQueries } from './character/characterQueries';
import { characterMutations } from './character/characterMutations';

// Re-export types for backward compatibility
export type { DatabaseCharacter } from './character/characterTypes';

// Main character service that combines all modules
export const characterService = {
  // Query methods
  getCharacterById: characterQueries.getCharacterById,
  getUserCharacters: characterQueries.getUserCharacters,
  getCharacterStats: characterQueries.getCharacterStats,

  // Mutation methods
  createCharacter: characterMutations.createCharacter,
  updateCharacter: characterMutations.updateCharacter,
  deleteCharacter: characterMutations.deleteCharacter,
  duplicateCharacter: characterMutations.duplicateCharacter,
};
