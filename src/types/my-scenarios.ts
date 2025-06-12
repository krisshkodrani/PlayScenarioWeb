
export interface FilterState {
  status: 'all' | 'published' | 'draft' | 'private';
  search: string;
  sortBy: 'created_desc' | 'created_asc' | 'title' | 'plays_desc' | 'likes_desc';
}

export interface ScenarioStats {
  totalScenarios: number;
  publishedScenarios: number;
  draftScenarios: number;
  totalPlays: number;
  totalLikes: number;
  averageRating: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
