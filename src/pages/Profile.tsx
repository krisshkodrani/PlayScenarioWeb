
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/navigation/PageHeader';
import AccountSection from '@/components/profile/AccountSection';
import SecuritySection from '@/components/profile/SecuritySection';
import PrivacySection from '@/components/profile/PrivacySection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Shield } from 'lucide-react';

interface ProfileData {
  username: string | null;
  display_name: string | null;
  bio: string | null;
  credits: number;
  created_at: string;
  profile_visibility: string | null;
  show_email_publicly: boolean | null;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, bio, credits, created_at, profile_visibility, show_email_publicly')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Profile Settings"
            subtitle="Manage your account preferences and information"
            showBackButton={true}
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Profile Settings"
            subtitle="Manage your account preferences and information"
            showBackButton={true}
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Not Found</h2>
              <p className="text-slate-400">
                Unable to load your profile information. Please try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Profile Settings"
          subtitle="Manage your account preferences and information"
          showBackButton={true}
        />
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-gray-700">
              <TabsTrigger 
                value="account" 
                className="flex items-center gap-2 data-[state=active]:bg-cyan-400 data-[state=active]:text-slate-900"
              >
                <User className="w-4 h-4" />
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex items-center gap-2 data-[state=active]:bg-cyan-400 data-[state=active]:text-slate-900"
              >
                <Lock className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="flex items-center gap-2 data-[state=active]:bg-violet-400 data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <AccountSection 
                profile={profile} 
                userEmail={user?.email || ''} 
                onProfileUpdate={fetchProfile}
              />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySection />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySection 
                profile={profile} 
                onProfileUpdate={fetchProfile}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
