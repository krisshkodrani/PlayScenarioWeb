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
    console.log('🔄 Starting scenario image upload process...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      scenarioId: scenarioId || 'not provided'
    });

    try {
      // Validate file type
      console.log('✅ Validating file type:', file.type);
      if (!this.allowedTypes.includes(file.type)) {
        console.error('❌ Invalid file type:', file.type, 'Allowed:', this.allowedTypes);
        return {
          success: false,
          error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.'
        };
      }

      // Validate file size
      console.log('✅ Validating file size:', file.size, 'bytes (max:', this.maxFileSize, ')');
      if (file.size > this.maxFileSize) {
        console.error('❌ File too large:', file.size, 'bytes, max allowed:', this.maxFileSize);
        return {
          success: false,
          error: `File size too large (${Math.round(file.size / 1024 / 1024 * 100) / 100}MB). Please upload an image smaller than 5MB.`
        };
      }

      // Get current user
      console.log('🔐 Getting current user...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Auth error:', userError);
        return {
          success: false,
          error: 'Authentication error. Please try logging out and back in.'
        };
      }
      
      if (!user) {
        console.error('❌ No authenticated user found');
        return {
          success: false,
          error: 'You must be logged in to upload images.'
        };
      }

      console.log('✅ User authenticated:', user.id);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${scenarioId || Date.now()}.${fileExt}`;
      console.log('📂 Generated file path:', fileName);

      // Upload file to Supabase Storage
      console.log('⬆️ Uploading to Supabase Storage...');
      const { data, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('❌ Upload error details:', {
          message: uploadError.message,
          details: uploadError,
          bucket: this.bucketName,
          fileName: fileName
        });
        
        // Provide more specific error messages
        if (uploadError.message?.includes('Duplicate')) {
          return {
            success: false,
            error: 'A file with this name already exists. Please try again or rename your file.'
          };
        } else if (uploadError.message?.includes('not found')) {
          return {
            success: false,
            error: 'Storage bucket not accessible. Please contact support.'
          };
        } else if (uploadError.message?.includes('policy')) {
          return {
            success: false,
            error: 'Permission denied. Please ensure you are logged in and try again.'
          };
        } else {
          return {
            success: false,
            error: `Upload failed: ${uploadError.message || 'Unknown error'}`
          };
        }
      }

      console.log('✅ Upload successful:', data);

      // Get public URL
      console.log('🔗 Getting public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      console.log('✅ Upload complete! Public URL:', publicUrl);

      return {
        success: true,
        imageUrl: publicUrl
      };

    } catch (error) {
      console.error('❌ Unexpected scenario image upload error:', error);
      return {
        success: false,
        error: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async deleteScenarioImage(imageUrl: string): Promise<boolean> {
    console.log('🗑️ Starting scenario image deletion...', imageUrl);
    
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const folderName = urlParts[urlParts.length - 2];
      const filePath = `${folderName}/${fileName}`;
      
      console.log('📂 Deleting file path:', filePath);

      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('❌ Delete error:', error);
        return false;
      }

      console.log('✅ Image deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Scenario image delete error:', error);
      return false;
    }
  }
}

export const scenarioImageService = new ScenarioImageService();