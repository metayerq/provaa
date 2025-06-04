
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageUpload = () => {
  const uploadImage = async (file: File, eventId: string): Promise<string | null> => {
    try {
      console.log('📤 Starting image upload for event:', eventId);
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        const error = 'File size must be less than 5MB';
        console.error('❌ File too large:', file.size);
        toast.error(error);
        throw new Error(error);
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        const error = 'Please select a valid image file';
        console.error('❌ Invalid file type:', file.type);
        toast.error(error);
        throw new Error(error);
      }

      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('❌ Authentication error:', sessionError);
        toast.error('You must be signed in to upload images');
        throw new Error('You must be signed in to upload images');
      }

      console.log('✅ User authenticated, proceeding with upload');

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${eventId}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('📂 Uploading to path:', filePath);

      // Show upload progress
      toast.loading('Uploading image...', { id: 'image-upload' });

      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('❌ Image upload error:', error);
        toast.error('Failed to upload image. Please try again.', { id: 'image-upload' });
        throw error;
      }

      console.log('📤 Upload response:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', urlData.publicUrl);
      
      // Show success message
      toast.success('Image uploaded successfully!', { id: 'image-upload' });
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('❌ Error uploading image:', error);
      
      // Dismiss loading toast and show error
      toast.dismiss('image-upload');
      
      if (!error.message?.includes('You must be signed in') && 
          !error.message?.includes('File size must be') && 
          !error.message?.includes('Please select a valid')) {
        toast.error('Failed to upload image. Please check your connection and try again.');
      }
      
      return null;
    }
  };

  return { uploadImage };
};
