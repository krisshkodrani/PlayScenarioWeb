
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const accountSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').max(50, 'Username must be less than 50 characters').optional().or(z.literal('')),
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(100, 'Display name must be less than 100 characters').optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal(''))
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountSectionProps {
  profile: {
    username: string | null;
    display_name: string | null;
    bio: string | null;
    credits: number;
    created_at: string;
  };
  userEmail: string;
  onProfileUpdate: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ profile, userEmail, onProfileUpdate }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: profile.username || '',
      display_name: profile.display_name || '',
      bio: profile.bio || ''
    }
  });

  const onSubmit = async (data: AccountFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: data.username || null,
          display_name: data.display_name || null,
          bio: data.bio || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your account information has been saved successfully.",
      });

      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-700 border-gray-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="Enter your username"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-700 border-gray-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                      placeholder="Enter your display name"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Bio</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 resize-vertical"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </Card>

      <Card className="bg-slate-800 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Details</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-slate-300">Email Address</Label>
            <div className="mt-1 p-3 bg-gray-700 rounded-lg border border-gray-600">
              <span className="text-white">{userEmail}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-slate-300">Credits Balance</Label>
            <div className="mt-1 p-3 bg-gray-700 rounded-lg border border-gray-600">
              <span className="text-white font-mono">{profile.credits}</span>
            </div>
          </div>
          
          <div>
            <Label className="text-slate-300">Member Since</Label>
            <div className="mt-1 p-3 bg-gray-700 rounded-lg border border-gray-600">
              <span className="text-white">{formatDate(profile.created_at)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountSection;
