
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff } from 'lucide-react';

const privacySchema = z.object({
  profile_visibility: z.enum(['public', 'private']),
  show_email_publicly: z.boolean()
});

type PrivacyFormData = z.infer<typeof privacySchema>;

interface PrivacySectionProps {
  profile: {
    profile_visibility: string | null;
    show_email_publicly: boolean | null;
  };
  onProfileUpdate: () => void;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ profile, onProfileUpdate }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<PrivacyFormData>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      profile_visibility: (profile.profile_visibility as 'public' | 'private') || 'public',
      show_email_publicly: profile.show_email_publicly || false
    }
  });

  const onSubmit = async (data: PrivacyFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_visibility: data.profile_visibility,
          show_email_publicly: data.show_email_publicly,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved successfully.",
      });

      onProfileUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isPublic = form.watch('profile_visibility') === 'public';

  return (
    <Card className="bg-slate-800 border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-violet-400" />
        <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profile_visibility"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-slate-300">Profile Visibility</FormLabel>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        field.value === 'public' 
                          ? 'bg-cyan-400/20 border-2 border-cyan-400' 
                          : 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Eye className={`w-4 h-4 ${field.value === 'public' ? 'text-cyan-400' : 'text-gray-400'}`} />
                    </div>
                    <label className="flex flex-col cursor-pointer flex-1">
                      <input
                        type="radio"
                        value="public"
                        checked={field.value === 'public'}
                        onChange={() => field.onChange('public')}
                        className="sr-only"
                      />
                      <span className="text-white font-medium">Public Profile</span>
                      <span className="text-sm text-slate-400">Your profile is visible to all users</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        field.value === 'private' 
                          ? 'bg-violet-400/20 border-2 border-violet-400' 
                          : 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <EyeOff className={`w-4 h-4 ${field.value === 'private' ? 'text-violet-400' : 'text-gray-400'}`} />
                    </div>
                    <label className="flex flex-col cursor-pointer flex-1">
                      <input
                        type="radio"
                        value="private"
                        checked={field.value === 'private'}
                        onChange={() => field.onChange('private')}
                        className="sr-only"
                      />
                      <span className="text-white font-medium">Private Profile</span>
                      <span className="text-sm text-slate-400">Only you can see your profile information</span>
                    </label>
                  </div>
                </div>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="show_email_publicly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value && isPublic}
                    onCheckedChange={field.onChange}
                    disabled={!isPublic}
                    className="data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className={`text-slate-300 ${!isPublic ? 'opacity-50' : ''}`}>
                    Show email address publicly
                  </FormLabel>
                  <FormDescription className={`text-slate-400 ${!isPublic ? 'opacity-50' : ''}`}>
                    {isPublic 
                      ? "Other users will be able to see your email address on your profile"
                      : "This option is only available for public profiles"
                    }
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-violet-400 text-white hover:bg-violet-300 font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default PrivacySection;
