import { supabase } from '@/integrations/supabase/client';

export interface MessageReaction {
  id: string;
  user_id: string;
  message_id: string;
  reaction_type: 'like' | 'dislike';
  feedback_details?: string;
  message_text?: string;
  created_at: string;
}

export interface SubmitReactionData {
  messageId: string;
  reactionType: 'like' | 'dislike';
  feedbackDetails?: string;
}

export const reactionService = {
  /**
   * Submit a new message reaction or update existing one
   */
  async submitMessageReaction({
    messageId,
    reactionType,
    feedbackDetails
  }: SubmitReactionData): Promise<MessageReaction> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to submit reactions');
    }

    // Fetch the message text to store with the reaction
    const { data: messageData, error: messageError } = await supabase
      .from('instance_messages')
      .select('message')
      .eq('id', messageId)
      .single();

    if (messageError) {
      throw new Error(`Failed to fetch message: ${messageError.message}`);
    }

    // Try to upsert the reaction (insert or update if exists)
    const { data, error } = await supabase
      .from('message_reactions')
      .upsert(
        {
          user_id: user.id,
          message_id: messageId,
          reaction_type: reactionType,
          feedback_details: feedbackDetails || null,
          message_text: messageData.message
        },
        {
          onConflict: 'user_id,message_id',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to submit reaction: ${error.message}`);
    }

    return data as MessageReaction;
  },

  /**
   * Get user's existing reaction for a specific message
   */
  async getUserMessageReaction(messageId: string): Promise<MessageReaction | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('message_id', messageId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get user reaction: ${error.message}`);
    }

    return data as MessageReaction;
  },

  /**
   * Delete a user's reaction
   */
  async deleteMessageReaction(messageId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to delete reactions');
    }

    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('user_id', user.id)
      .eq('message_id', messageId);

    if (error) {
      throw new Error(`Failed to delete reaction: ${error.message}`);
    }
  },

  /**
   * Get reaction counts for a message
   */
  async getMessageReactionCounts(messageId: string): Promise<{
    likeCount: number;
    dislikeCount: number;
  }> {
    const { data, error } = await supabase
      .from('message_reactions')
      .select('reaction_type')
      .eq('message_id', messageId);

    if (error) {
      throw new Error(`Failed to get reaction counts: ${error.message}`);
    }

    const likeCount = data.filter(r => r.reaction_type === 'like').length;
    const dislikeCount = data.filter(r => r.reaction_type === 'dislike').length;

    return { likeCount, dislikeCount };
  }
};