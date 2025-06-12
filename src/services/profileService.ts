
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileStatistics {
  scenariosCreated: number;
  gamesPlayed: number;
  gamesWon: number;
  totalLikes: number;
  totalPlays: number;
  creditsEarned: number;
  averageScore: number;
}

class ProfileService {
  async getCurrentUserProfile(): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw new Error(error.message);

    return {
      id: user.id,
      email: user.email || '',
      username: profile?.username || null,
      credits: profile?.credits || 0,
      created_at: user.created_at || '',
      updated_at: profile?.updated_at || ''
    };
  }

  async updateUsername(username: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ username, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw new Error(error.message);
  }

  async getProfileStatistics(): Promise<ProfileStatistics> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get transactions for credits earned
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'credit');

    const creditsEarned = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // Mock statistics for now since we don't have scenarios/games tables yet
    return {
      scenariosCreated: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      totalLikes: 0,
      totalPlays: 0,
      creditsEarned,
      averageScore: 0
    };
  }

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) throw new Error(error.message);
  }

  async getTransactionHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);
    return transactions || [];
  }
}

export const profileService = new ProfileService();
