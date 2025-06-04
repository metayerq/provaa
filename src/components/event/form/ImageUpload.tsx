
import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  existingImageUrl?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange, 
  error, 
  existingImageUrl 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Update preview when value changes or when component mounts with existing image
  React.useEffect(() => {
    console.log('🖼️ ImageUpload useEffect triggered:', {
      hasNewFile: !!value,
      newFileSize: value?.size,
      hasExistingImageUrl: !!existingImageUrl,
      existingImageUrl: existingImageUrl
    });

    // Clear any previous upload errors when a new file is selected
    setUploadError(null);

    if (value && value.size > 0) {
      // New file selected - create preview
      setImageLoading(true);
      const url = URL.createObjectURL(value);
      setPreview(url);
      console.log('✅ New image preview created:', { fileName: value.name, size: value.size, url });
      setImageLoading(false);
      return () => {
        URL.revokeObjectURL(url);
        console.log('🧹 Preview URL revoked:', url);
      };
    } else if (existingImageUrl && !value) {
      // Show existing image if no new file is selected
      setImageLoading(true);
      setPreview(existingImageUrl);
      console.log('📷 Showing existing image:', existingImageUrl);
    } else {
      // No image to show
      setPreview(null);
      setImageLoading(false);
      console.log('❌ No image to display');
    }
  }, [value, existingImageUrl]);

  const validateFile = (file: File): string | null => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file (JPG, PNG, GIF, etc.)';
    }

    return null;
  };

  const handleFileSelection = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      console.log('❌ File validation failed:', validationError);
      return;
    }

    setUploadError(null);
    console.log('📁 Valid file selected:', { name: file.name, size: file.size, type: file.type });
    onChange(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    console.log('🗑️ Image removed');
    onChange(null);
    setPreview(null);
    setUploadError(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="event-image">Event Banner Image</Label>
      
      {/* Show upload error */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      {preview ? (
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          <img
            src={preview}
            alt="Event preview"
            className="w-full h-48 object-cover rounded-lg border"
            onLoad={() => {
              console.log('✅ Image loaded successfully:', preview);
              setImageLoading(false);
            }}
            onError={(e) => {
              console.error('❌ Image failed to load:', preview, e);
              setPreview(null);
              setImageLoading(false);
              setUploadError('Failed to load image preview');
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={imageLoading}
          >
            <X className="h-4 w-4" />
          </Button>
          {existingImageUrl && !value && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              Current Image
            </div>
          )}
          {value && (
            <div className="absolute bottom-2 left-2 bg-green-500/80 text-white px-2 py-1 rounded text-xs">
              New Image Ready to Save
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-50' 
              : uploadError
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <ImageIcon className={`mx-auto h-12 w-12 mb-4 ${uploadError ? 'text-red-400' : 'text-gray-400'}`} />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Drag and drop your event image here, or
            </p>
            <Button type="button" variant="outline" asChild>
              <label htmlFor="event-image" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </label>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Recommended: 1200x600px, max 5MB (JPG, PNG, GIF)
          </p>
        </div>
      )}
      
      <input
        id="event-image"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
