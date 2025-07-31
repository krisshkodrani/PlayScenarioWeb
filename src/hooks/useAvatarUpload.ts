import { useState, useCallback } from 'react';
import { avatarService, AvatarUploadResult } from '@/services/avatarService';
import { useToast } from '@/hooks/use-toast';

interface UseAvatarUploadReturn {
  uploading: boolean;
  uploadAvatar: (file: File, characterId?: string) => Promise<AvatarUploadResult>;
  deleteAvatar: (avatarUrl: string) => Promise<boolean>;
}

export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = useCallback(async (file: File, characterId?: string): Promise<AvatarUploadResult> => {
    setUploading(true);
    
    try {
      const result = await avatarService.uploadCharacterAvatar(file, characterId);
      
      if (result.success) {
        toast({
          title: "Avatar Uploaded",
          description: "Character avatar has been successfully uploaded.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Failed to upload avatar.",
          variant: "destructive",
        });
      }
      
      return result;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const deleteAvatar = useCallback(async (avatarUrl: string): Promise<boolean> => {
    try {
      const success = await avatarService.deleteCharacterAvatar(avatarUrl);
      
      if (success) {
        toast({
          title: "Avatar Removed",
          description: "Character avatar has been removed.",
        });
      } else {
        toast({
          title: "Removal Failed",
          description: "Failed to remove avatar.",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Failed to remove avatar.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    uploading,
    uploadAvatar,
    deleteAvatar,
  };
};