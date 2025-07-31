import { supabase } from '@/integrations/supabase/client';

export interface AvatarUploadResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

export const avatarService = {
  async uploadCharacterAvatar(file: File, characterId?: string): Promise<AvatarUploadResult> {
    try {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: 'File size must be less than 2MB' };
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'File must be an image (JPEG, PNG, WebP, or GIF)' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = characterId ? `${characterId}/${fileName}` : `temp/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('character-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Avatar upload error:', error);
        return { success: false, error: 'Failed to upload avatar' };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('character-avatars')
        .getPublicUrl(data.path);

      return { 
        success: true, 
        avatarUrl: publicUrlData.publicUrl 
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      return { success: false, error: 'Failed to upload avatar' };
    }
  },

  async deleteCharacterAvatar(avatarUrl: string): Promise<boolean> {
    try {
      // Extract path from URL
      const path = avatarUrl.split('/').slice(-2).join('/');
      
      const { error } = await supabase.storage
        .from('character-avatars')
        .remove([path]);

      if (error) {
        console.error('Avatar deletion error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Avatar deletion error:', error);
      return false;
    }
  }
};