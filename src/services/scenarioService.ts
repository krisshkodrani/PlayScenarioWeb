
// Main scenario service - exports all functionality
export * from './scenario/scenarioTypes';
export * from './scenario/scenarioActions';
export * from './scenario/scenarioRetrieval';
export * from './scenario/scenarioInteractions';

// Legacy export for backward compatibility
import {
  createScenario,
  updateScenario,
  deleteScenario,
  toggleScenarioPublic,
  duplicateScenario
} from './scenario/scenarioActions';

import {
  getUserScenarios,
  getPublicScenarios,
  getScenarioById,
  getScenarioStats
} from './scenario/scenarioRetrieval';

import {
  toggleScenarioLike,
  toggleScenarioBookmark
} from './scenario/scenarioInteractions';

import { mapDatabaseScenario, generateAvatarColor } from './scenario/scenarioTransforms';

export const scenarioService = {
  // Create and modify scenarios
  createScenario,
  updateScenario,
  deleteScenario,
  toggleScenarioPublic,
  duplicateScenario,
  
  // Retrieve scenarios
  getUserScenarios,
  getPublicScenarios,
  getScenarioById,
  getScenarioStats,
  
  // User interactions
  toggleScenarioLike,
  toggleScenarioBookmark,
  
  // Helper functions
  mapDatabaseScenario,
  generateAvatarColor
};
