
export interface ScenarioFilters {
  search: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | '';
  isPublic?: boolean;
  sortBy: 'created_desc' | 'created_asc' | 'title' | 'popularity' | 'rating';
}

export interface ScenarioStats {
  totalScenarios: number;
  publicScenarios: number;
  privateScenarios: number;
  totalPlays: number;
  totalLikes: number;
  averageRating: number;
}

export interface ScenarioPaginationResult<T> {
  scenarios: T[];
  total: number;
}
