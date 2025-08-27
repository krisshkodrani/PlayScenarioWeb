import { useState, useCallback } from 'react';
import { scenarioImageService, ScenarioImageUploadResult } from '@/services/scenarioImageService';
import { useToast } from '@/hooks/use-toast';

interface UseScenarioImageUploadReturn {
  uploading: boolean;
  uploadImage: (file: File, scenarioId?: string) => Promise<ScenarioImageUploadResult>;
  deleteImage: (imageUrl: string) => Promise<boolean>;
  retryUpload: (file: File, scenarioId?: string) => Promise<ScenarioImageUploadResult>;
}

export const useScenarioImageUpload = (): UseScenarioImageUploadReturn => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File, scenarioId?: string): Promise<ScenarioImageUploadResult> => {
    console.log('🔄 Hook: Starting image upload...');
    setUploading(true);
    
    try {
      const result = await scenarioImageService.uploadScenarioImage(file, scenarioId);
      
      if (result.success) {
        console.log('✅ Hook: Upload successful');
        toast({
          title: "Image Uploaded",
          description: "Scenario featured image has been successfully uploaded.",
        });
      } else {
        console.error('❌ Hook: Upload failed:', result.error);
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload scenario image.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error('❌ Hook: Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Upload Failed",
        description: `Unexpected error: ${errorMessage}`,
        variant: "destructive",
      });
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const retryUpload = useCallback(async (file: File, scenarioId?: string): Promise<ScenarioImageUploadResult> => {
    console.log('🔄 Hook: Retrying upload...');
    // Add a small delay before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    return uploadImage(file, scenarioId);
  }, [uploadImage]);

  const deleteImage = useCallback(async (imageUrl: string): Promise<boolean> => {
    try {
      const success = await scenarioImageService.deleteScenarioImage(imageUrl);
      
      if (success) {
        toast({
          title: "Image Removed",
          description: "Scenario featured image has been removed.",
        });
      } else {
        toast({
          title: "Removal Failed",
          description: "Failed to remove scenario image.",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Failed to remove scenario image.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    uploading,
    uploadImage,
    deleteImage,
    retryUpload,
  };
};