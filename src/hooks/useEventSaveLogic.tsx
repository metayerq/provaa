
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EventForm } from '@/components/event/form/types';
import { useImageUpload } from '@/hooks/useImageUpload';

export const useEventSaveLogic = () => {
  const navigate = useNavigate();
  const { uploadImage } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingAsDraft, setSavingAsDraft] = useState(false);

  const handleSave = async (data: EventForm, isDraft: boolean = false, id: string, event: any, setEvent: any) => {
    if (!id || !event) {
      console.error('❌ Cannot save: missing event ID or event data');
      toast.error("Cannot save: missing event information");
      return;
    }

    try {
      setIsSubmitting(true);
      setSavingAsDraft(isDraft);

      console.log('💾 Starting save process:', {
        eventId: id,
        isDraft,
        hasNewImage: !!data.image,
        imageSize: data.image?.size,
        existingImageUrl: data.existingImageUrl,
        capacityChange: data.capacity !== event.capacity
      });

      // Show saving progress
      const savingToastId = toast.loading(isDraft ? 'Saving as draft...' : 'Saving changes...');

      // Format the date to a string
      const formattedDate = data.date ? data.date.toISOString() : null;

      // Prepare location data
      const locationData = {
        venue_name: data.venueName,
        address: data.address,
        city: data.city,
        is_online: data.isOnline
      };

      // Handle image upload if a new image was selected
      let imageUrl = data.existingImageUrl || '';
      
      if (data.image && data.image.size > 0) {
        console.log('📤 Uploading new image for event:', id);
        const uploadedImageUrl = await uploadImage(data.image, id);
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
          console.log('✅ New image uploaded successfully:', uploadedImageUrl);
        } else {
          console.error('❌ Image upload failed');
          toast.dismiss(savingToastId);
          toast.error("Failed to upload image. Please try again.");
          return;
        }
      } else {
        console.log('📷 No new image to upload, keeping existing:', imageUrl);
      }

      // Prepare products data for storage - convert to plain objects that satisfy Json type
      const productsData = data.products?.filter(product => 
        product.name.trim() || product.producer.trim()
      ).map(product => ({
        name: product.name,
        producer: product.producer,
        year: product.year,
        type: product.type
      })) || [];

      console.log('📦 Preparing products for save:', productsData);

      // Prepare the data to be sent to Supabase
      const eventData = {
        category: data.category,
        title: data.title,
        description: data.description,
        ambiance_description: data.ambianceDescription,
        date: formattedDate,
        time: data.time,
        duration: data.duration,
        location: locationData,
        capacity: data.capacity,
        price: data.price,
        accessibility_info: data.accessibilityInfo,
        dress_code: data.dressCode,
        dietary_options: data.dietaryOptions,
        meeting_point_details: data.meetingPointDetails,
        cancellation_policy: data.cancellationPolicy,
        image: imageUrl,
        products: productsData,
      };

      console.log('💾 Updating event with data:', {
        id: id,
        hasImage: !!eventData.image,
        imageUrl: eventData.image,
        productsCount: eventData.products.length,
        capacityUpdate: eventData.capacity
      });

      // If capacity changed, use the special capacity update function
      if (data.capacity !== event.capacity) {
        console.log('📊 Capacity changed, updating with special function');
        const { error: capacityError } = await supabase.rpc('update_event_capacity', {
          event_id: id,
          new_capacity: data.capacity
        });

        if (capacityError) {
          console.error('❌ Capacity update error:', capacityError);
          toast.dismiss(savingToastId);
          toast.error("Failed to update capacity. Please try again.");
          throw capacityError;
        }
      }

      // Update the event in the database
      const { error: updateError } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id);

      if (updateError) {
        console.error('❌ Database update error:', updateError);
        toast.dismiss(savingToastId);
        toast.error("Failed to save changes. Please try again.");
        throw updateError;
      }

      // Update local event data
      setEvent(prev => prev ? { ...prev, ...eventData } : null);

      console.log('✅ Event updated successfully');
      toast.dismiss(savingToastId);
      toast.success(isDraft ? "Event saved as draft!" : "Event updated successfully!");
      
      if (!isDraft) {
        navigate(`/events/${id}`);
      }
    } catch (error) {
      console.error("❌ Error updating event:", error);
      toast.error("Failed to update event. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
      setSavingAsDraft(false);
    }
  };

  return {
    handleSave,
    isSubmitting,
    savingAsDraft
  };
};
