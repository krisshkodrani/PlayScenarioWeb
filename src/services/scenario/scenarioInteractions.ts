
import { supabase } from '@/integrations/supabase/client';

export const toggleScenarioLike = async (scenarioId: string, isLiked: boolean): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  if (isLiked) {
    const { error } = await supabase
      .from('scenario_likes')
      .insert({
        scenario_id: scenarioId,
        user_id: user.id
      });

    if (error && error.code !== '23505') {
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
};

export const toggleScenarioBookmark = async (scenarioId: string, isBookmarked: boolean): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  if (isBookmarked) {
    const { error } = await supabase
      .from('scenario_bookmarks')
      .insert({
        scenario_id: scenarioId,
        user_id: user.id
      });

    if (error && error.code !== '23505') {
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
};
