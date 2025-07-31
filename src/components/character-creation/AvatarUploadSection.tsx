import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Camera } from 'lucide-react';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { getCharacterColor } from '@/utils/characterColors';

interface AvatarUploadSectionProps {
  characterName: string;
  avatarUrl?: string;
  onAvatarChange: (avatarUrl: string | undefined) => void;
}

const AvatarUploadSection: React.FC<AvatarUploadSectionProps> = ({
  characterName,
  avatarUrl,
  onAvatarChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { uploading, uploadAvatar, deleteAvatar } = useAvatarUpload();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const handleFileSelect = async (file: File) => {
    const result = await uploadAvatar(file);
    if (result.success && result.avatarUrl) {
      onAvatarChange(result.avatarUrl);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleRemoveAvatar = async () => {
    if (avatarUrl) {
      const success = await deleteAvatar(avatarUrl);
      if (success) {
        onAvatarChange(undefined);
      }
    }
  };

  const avatarColor = getCharacterColor(characterName);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-300">
        Character Avatar
      </label>
      
      <div className="flex items-center gap-6">
        {/* Avatar Preview */}
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} alt={characterName} />
            <AvatarFallback className={`${avatarColor} text-white font-semibold text-lg`}>
              {getInitials(characterName)}
            </AvatarFallback>
          </Avatar>
          
          {avatarUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={handleRemoveAvatar}
              disabled={uploading}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver 
                ? 'border-cyan-400 bg-cyan-400/10' 
                : 'border-gray-600 hover:border-gray-500'
            } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
              
              <div>
                <p className="text-sm font-medium text-white">
                  {uploading ? 'Uploading...' : 'Upload avatar image'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Drag & drop or click to select • Max 2MB • JPG, PNG, WebP, GIF
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose File
            </Button>
            
            {avatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadSection;