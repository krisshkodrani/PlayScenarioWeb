import { useState, useCallback } from 'react';
import { scenarioImageService, ScenarioImageUploadResult } from '@/services/scenarioImageService';
import { useToast } from '@/hooks/use-toast';

interface UseScenarioImageUploadReturn {
  uploading: boolean;
  uploadImage: (file: File, scenarioId?: string) => Promise<ScenarioImageUploadResult>;
  deleteImage: (imageUrl: string) => Promise<boolean>;
}

export const useScenarioImageUpload = (): UseScenarioImageUploadReturn => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File, scenarioId?: string): Promise<ScenarioImageUploadResult> => {
    setUploading(true);
    
    try {
      const result = await scenarioImageService.uploadScenarioImage(file, scenarioId);
      
      if (result.success) {
        toast({
          title: "Image Uploaded",
          description: "Scenario featured image has been successfully uploaded.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload scenario image.",
          variant: "destructive",
        });
      }
      
      return result;
    } finally {
      setUploading(false);
    }
  }, [toast]);

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
  };
};