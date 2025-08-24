import { supabase } from '@/integrations/supabase/client';

export interface ScenarioImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

class ScenarioImageService {
  private readonly bucketName = 'scenario-images';
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  async uploadScenarioImage(file: File, scenarioId?: string): Promise<ScenarioImageUploadResult> {
    try {
      // Validate file type
      if (!this.allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.'
        };
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        return {
          success: false,
          error: 'File size too large. Please upload an image smaller than 5MB.'
        };
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return {
          success: false,
          error: 'Authentication required to upload images.'
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${scenarioId || Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return {
          success: false,
          error: 'Failed to upload image. Please try again.'
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      return {
        success: true,
        imageUrl: publicUrl
      };

    } catch (error) {
      console.error('Scenario image upload error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during upload.'
      };
    }
  }

  async deleteScenarioImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderName = urlParts[urlParts.length - 2];
      const filePath = `${folderName}/${fileName}`;

      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Scenario image delete error:', error);
      return false;
    }
  }
}

export const scenarioImageService = new ScenarioImageService();