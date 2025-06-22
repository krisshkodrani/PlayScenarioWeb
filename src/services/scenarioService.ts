
import { supabase } from '@/integrations/supabase/client';
import { ScenarioData, Scenario } from '@/types/scenario';

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

export const scenarioService = {
  // Create a new scenario
  async createScenario(scenarioData: ScenarioData): Promise<Scenario | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenarios')
      .insert({
        title: scenarioData.title,
        description: scenarioData.description,
        objectives: scenarioData.objectives as any,
        win_conditions: scenarioData.win_conditions,
        lose_conditions: scenarioData.lose_conditions,
        max_turns: scenarioData.max_turns,
        initial_scene_prompt: scenarioData.initial_scene_prompt,
        is_public: scenarioData.is_public,
        creator_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating scenario:', error);
      throw error;
    }

    // Create associated characters
    if (scenarioData.characters && scenarioData.characters.length > 0) {
      const charactersToInsert = scenarioData.characters.map(char => ({
        scenario_id: data.id,
        name: char.name,
        personality: char.personality,
        expertise_keywords: char.expertise_keywords,
        is_player_character: char.is_player_character,
        creator_id: user.id,
        role: 'Team Member'
      }));

      const { error: charactersError } = await supabase
        .from('scenario_characters')
        .insert(charactersToInsert);

      if (charactersError) {
        console.error('Error creating scenario characters:', charactersError);
      }
    }

    return this.mapDatabaseScenario(data);
  },

  // Get user's scenarios with filters
  async getUserScenarios(filters: ScenarioFilters, page = 1, limit = 12): Promise<{
    scenarios: Scenario[];
    total: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('scenarios')
      .select(`
        *,
        scenario_characters(
          id,
          name,
          role,
          personality,
          expertise_keywords
        ),
        profiles!scenarios_creator_id_fkey(username)
      `, { count: 'exact' })
      .eq('creator_id', user.id);

    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.isPublic !== undefined) {
      query = query.eq('is_public', filters.isPublic);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'created_asc':
        query = query.order('created_at', { ascending: true });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      case 'popularity':
        query = query.order('play_count', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_score', { ascending: false, nullsFirst: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const startRange = (page - 1) * limit;
    const endRange = startRange + limit - 1;
    query = query.range(startRange, endRange);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching user scenarios:', error);
      throw error;
    }

    const scenarios = (data || []).map(scenario => {
      const mappedScenario = this.mapDatabaseScenario(scenario);
      
      // Add characters to scenario
      if (scenario.scenario_characters) {
        mappedScenario.characters = scenario.scenario_characters.map((char: any) => ({
          id: char.id,
          name: char.name,
          role: char.role,
          personality: char.personality,
          expertise_keywords: char.expertise_keywords,
          avatar_color: this.generateAvatarColor(char.name)
        }));
        mappedScenario.character_count = mappedScenario.characters.length;
      }
      
      return mappedScenario;
    });

    return {
      scenarios,
      total: count || 0
    };
  },

  // Get public scenarios for browsing
  async getPublicScenarios(filters: ScenarioFilters, page = 1, limit = 12): Promise<{
    scenarios: Scenario[];
    total: number;
  }> {
    let query = supabase
      .from('scenarios')
      .select(`
        *,
        scenario_characters(
          id,
          name,
          role,
          personality,
          expertise_keywords
        ),
        profiles!scenarios_creator_id_fkey(username)
      `, { count: 'exact' })
      .eq('is_public', true);

    // Apply filters
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.category && filters.category !== 'all') {
      // For now, we'll filter by tags or description since we don't have a category column
      query = query.ilike('description', `%${filters.category}%`);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'created_asc':
        query = query.order('created_at', { ascending: true });
        break;
      case 'title':
        query = query.order('title', { ascending: true });
        break;
      case 'popularity':
        query = query.order('play_count', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_score', { ascending: false, nullsFirst: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const startRange = (page - 1) * limit;
    const endRange = startRange + limit - 1;
    query = query.range(startRange, endRange);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching public scenarios:', error);
      throw error;
    }

    // Check if user has liked/bookmarked scenarios
    const scenarios = await this.enrichScenariosWithUserData(data || []);

    return {
      scenarios,
      total: count || 0
    };
  },

  // Get scenario by ID
  async getScenarioById(scenarioId: string): Promise<Scenario | null> {
    const { data, error } = await supabase
      .from('scenarios')
      .select(`
        *,
        scenario_characters(*),
        profiles!scenarios_creator_id_fkey(username)
      `)
      .eq('id', scenarioId)
      .single();

    if (error) {
      console.error('Error fetching scenario:', error);
      return null;
    }

    const scenario = this.mapDatabaseScenario(data);
    
    // Add characters to scenario
    if (data.scenario_characters) {
      scenario.characters = data.scenario_characters.map((char: any) => ({
        id: char.id,
        name: char.name,
        role: char.role,
        personality: char.personality,
        expertise_keywords: char.expertise_keywords,
        avatar_color: this.generateAvatarColor(char.name)
      }));
      scenario.character_count = scenario.characters.length;
    }

    return scenario;
  },

  // Update scenario
  async updateScenario(scenarioId: string, updates: Partial<ScenarioData>): Promise<Scenario | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const dbUpdates: any = { ...updates };
    if (dbUpdates.objectives) {
      dbUpdates.objectives = dbUpdates.objectives as any;
    }

    const { data, error } = await supabase
      .from('scenarios')
      .update(dbUpdates)
      .eq('id', scenarioId)
      .eq('creator_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating scenario:', error);
      throw error;
    }

    return this.mapDatabaseScenario(data);
  },

  // Delete scenario
  async deleteScenario(scenarioId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Delete associated characters first
    await supabase
      .from('scenario_characters')
      .delete()
      .eq('scenario_id', scenarioId);

    // Delete the scenario
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', scenarioId)
      .eq('creator_id', user.id);

    if (error) {
      console.error('Error deleting scenario:', error);
      throw error;
    }
  },

  // Toggle scenario public status
  async toggleScenarioPublic(scenarioId: string, isPublic: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('scenarios')
      .update({ is_public: isPublic })
      .eq('id', scenarioId)
      .eq('creator_id', user.id);

    if (error) {
      console.error('Error toggling scenario public status:', error);
      throw error;
    }
  },

  // Duplicate scenario
  async duplicateScenario(scenarioId: string): Promise<Scenario | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get original scenario with characters
    const { data: original, error: fetchError } = await supabase
      .from('scenarios')
      .select(`
        *,
        scenario_characters(*)
      `)
      .eq('id', scenarioId)
      .single();

    if (fetchError) {
      console.error('Error fetching scenario for duplication:', fetchError);
      throw fetchError;
    }

    // Create duplicate scenario
    const { data: newScenario, error: insertError } = await supabase
      .from('scenarios')
      .insert({
        title: `${original.title} (Copy)`,
        description: original.description,
        objectives: original.objectives,
        win_conditions: original.win_conditions,
        lose_conditions: original.lose_conditions,
        max_turns: original.max_turns,
        initial_scene_prompt: original.initial_scene_prompt,
        is_public: false, // Always make copies private
        creator_id: user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error duplicating scenario:', insertError);
      throw insertError;
    }

    // Duplicate characters
    if (original.scenario_characters && original.scenario_characters.length > 0) {
      const charactersToInsert = original.scenario_characters.map((char: any) => ({
        scenario_id: newScenario.id,
        name: char.name,
        personality: char.personality,
        expertise_keywords: char.expertise_keywords,
        is_player_character: char.is_player_character,
        role: char.role,
        backstory: char.backstory,
        motivations: char.motivations,
        speech_patterns: char.speech_patterns,
        creator_id: user.id
      }));

      await supabase
        .from('scenario_characters')
        .insert(charactersToInsert);
    }

    return this.mapDatabaseScenario(newScenario);
  },

  // Like/unlike scenario
  async toggleScenarioLike(scenarioId: string, isLiked: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (isLiked) {
      const { error } = await supabase
        .from('scenario_likes')
        .insert({
          scenario_id: scenarioId,
          user_id: user.id
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error liking scenario:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('scenario_likes')
        .delete()
        .eq('scenario_id', scenarioId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unliking scenario:', error);
        throw error;
      }
    }
  },

  // Bookmark/unbookmark scenario
  async toggleScenarioBookmark(scenarioId: string, isBookmarked: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (isBookmarked) {
      const { error } = await supabase
        .from('scenario_bookmarks')
        .insert({
          scenario_id: scenarioId,
          user_id: user.id
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        console.error('Error bookmarking scenario:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('scenario_bookmarks')
        .delete()
        .eq('scenario_id', scenarioId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error unbookmarking scenario:', error);
        throw error;
      }
    }
  },

  // Get scenario statistics
  async getScenarioStats(): Promise<ScenarioStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenarios')
      .select('id, is_public, play_count, average_score, like_count')
      .eq('creator_id', user.id);

    if (error) {
      console.error('Error fetching scenario stats:', error);
      throw error;
    }

    const totalScenarios = data?.length || 0;
    const publicScenarios = data?.filter(s => s.is_public).length || 0;
    const privateScenarios = totalScenarios - publicScenarios;
    const totalPlays = data?.reduce((sum, s) => sum + (s.play_count || 0), 0) || 0;
    const totalLikes = data?.reduce((sum, s) => sum + (s.like_count || 0), 0) || 0;
    const averageRating = totalScenarios > 0 
      ? data?.reduce((sum, s) => sum + (s.average_score || 0), 0) / totalScenarios 
      : 0;

    return {
      totalScenarios,
      publicScenarios,
      privateScenarios,
      totalPlays,
      totalLikes,
      averageRating
    };
  },

  // Helper functions
  mapDatabaseScenario(dbScenario: any): Scenario {
    return {
      id: dbScenario.id,
      title: dbScenario.title,
      description: dbScenario.description,
      category: 'general', // Default category since we don't have this field yet
      difficulty: 'Intermediate', // Default difficulty since we don't have this field yet
      estimated_duration: dbScenario.max_turns ? dbScenario.max_turns * 2 : 30,
      character_count: 0, // Will be populated separately
      characters: [],
      objectives: Array.isArray(dbScenario.objectives) ? dbScenario.objectives : [],
      created_at: dbScenario.created_at,
      created_by: dbScenario.profiles?.username || 'Unknown',
      play_count: dbScenario.play_count || 0,
      average_rating: dbScenario.average_score ? Number(dbScenario.average_score) : 0,
      tags: [], // Default empty tags since we don't have this field yet
      is_liked: false,
      is_bookmarked: false,
      is_public: dbScenario.is_public
    };
  },

  async enrichScenariosWithUserData(scenarios: any[]): Promise<Scenario[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || scenarios.length === 0) {
      return scenarios.map(s => {
        const mappedScenario = this.mapDatabaseScenario(s);
        
        // Add characters to scenario
        if (s.scenario_characters) {
          mappedScenario.characters = s.scenario_characters.map((char: any) => ({
            id: char.id,
            name: char.name,
            role: char.role,
            personality: char.personality,
            expertise_keywords: char.expertise_keywords,
            avatar_color: this.generateAvatarColor(char.name)
          }));
          mappedScenario.character_count = mappedScenario.characters.length;
        }
        
        return mappedScenario;
      });
    }

    const scenarioIds = scenarios.map(s => s.id);

    // Get user's likes and bookmarks
    const [likesResult, bookmarksResult] = await Promise.all([
      supabase
        .from('scenario_likes')
        .select('scenario_id')
        .eq('user_id', user.id)
        .in('scenario_id', scenarioIds),
      supabase
        .from('scenario_bookmarks')
        .select('scenario_id')
        .eq('user_id', user.id)
        .in('scenario_id', scenarioIds)
    ]);

    const likedIds = new Set(likesResult.data?.map(l => l.scenario_id) || []);
    const bookmarkedIds = new Set(bookmarksResult.data?.map(b => b.scenario_id) || []);

    return scenarios.map(scenario => {
      const mappedScenario = this.mapDatabaseScenario(scenario);
      
      // Add characters to scenario
      if (scenario.scenario_characters) {
        mappedScenario.characters = scenario.scenario_characters.map((char: any) => ({
          id: char.id,
          name: char.name,
          role: char.role,
          personality: char.personality,
          expertise_keywords: char.expertise_keywords,
          avatar_color: this.generateAvatarColor(char.name)
        }));
        mappedScenario.character_count = mappedScenario.characters.length;
      }
      
      return {
        ...mappedScenario,
        is_liked: likedIds.has(scenario.id),
        is_bookmarked: bookmarkedIds.has(scenario.id)
      };
    });
  },

  generateAvatarColor(name: string): string {
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#eab308',
      '#84cc16', '#22c55e', '#10b981', '#14b8a6',
      '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
      '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }
};
