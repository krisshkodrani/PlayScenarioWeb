import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScenarioImageUpload } from '@/hooks/useScenarioImageUpload';

interface ScenarioImageUploadSectionProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  scenarioId?: string;
}

const ScenarioImageUploadSection: React.FC<ScenarioImageUploadSectionProps> = ({
  currentImageUrl,
  onImageChange,
  scenarioId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { uploading, uploadImage, deleteImage } = useScenarioImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    const result = await uploadImage(file, scenarioId);
    if (result.success && result.imageUrl) {
      onImageChange(result.imageUrl);
    } else {
      // Reset preview on failed upload
      setPreviewUrl(currentImageUrl || null);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl) {
      const success = await deleteImage(currentImageUrl);
      if (success) {
        setPreviewUrl(null);
        onImageChange(null);
      }
    } else {
      setPreviewUrl(null);
      onImageChange(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Featured Image</h3>
        <p className="text-sm text-slate-400 mb-4">
          Add an appealing featured image to make your scenario stand out. Recommended aspect ratio: 16:9 or 4:3.
        </p>
      </div>

      <Card className="p-6 bg-slate-800 border-gray-700">
        {previewUrl ? (
          <div className="relative">
            <div className="aspect-video w-full bg-slate-900 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Scenario featured image"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              onClick={handleRemoveImage}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            className="aspect-video w-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 transition-colors duration-200 bg-slate-900/50"
          >
            <ImageIcon className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 text-center mb-2">
              {uploading ? 'Uploading...' : 'Click to upload scenario image'}
            </p>
            <p className="text-xs text-gray-500 text-center">
              JPEG, PNG, WebP, or GIF (max 5MB)
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {previewUrl && (
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="sm"
              disabled={uploading}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
            >
              <Upload className="w-4 h-4 mr-2" />
              Replace Image
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ScenarioImageUploadSection;