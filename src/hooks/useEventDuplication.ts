
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEventDuplication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDuplicating, setIsDuplicating] = useState(false);

  const duplicateEvent = async (originalEvent: any, onSuccess?: () => void) => {
    if (!user) {
      toast.error("You must be logged in to duplicate events");
      return;
    }

    try {
      setIsDuplicating(true);
      console.log('Starting event duplication for event:', originalEvent.id);

      // Prepare the duplicated event data
      const duplicatedEventData = {
        host_id: user.id,
        title: `Copy of ${originalEvent.title}`,
        description: originalEvent.description,
        category: originalEvent.category,
        // Don't copy date/time - leave as null for draft status
        date: null,
        time: null,
        duration: originalEvent.duration,
        location: originalEvent.location,
        capacity: originalEvent.capacity,
        spots_left: originalEvent.capacity, // Reset to full capacity
        price: originalEvent.price,
        image: originalEvent.image,
        ambiance_description: originalEvent.ambiance_description,
        food_pairings: originalEvent.food_pairings,
        accessibility_info: originalEvent.accessibility_info,
        dress_code: originalEvent.dress_code,
        dietary_options: originalEvent.dietary_options,
        meeting_point_details: originalEvent.meeting_point_details,
        cancellation_policy: originalEvent.cancellation_policy,
        meta_title: originalEvent.meta_title,
        meta_description: originalEvent.meta_description,
        og_image_url: originalEvent.og_image_url,
        products: originalEvent.products
      };

      console.log('Duplicated event data:', duplicatedEventData);

      // Insert the duplicated event
      const { data: newEvent, error } = await supabase
        .from('events')
        .insert(duplicatedEventData)
        .select()
        .single();

      if (error) {
        console.error('Database error during duplication:', error);
        throw error;
      }

      console.log('Event duplicated successfully:', newEvent);

      // Show success toast
      toast.success("✅ Event duplicated to Drafts! Ready to customize.", {
        duration: 5000,
        action: {
          label: "Go to Drafts",
          onClick: () => {
            navigate('/host/events');
            // Set hash to trigger drafts tab
            window.location.hash = '#drafts';
          }
        }
      });

      if (onSuccess) {
        onSuccess();
      }

      return newEvent;
    } catch (error: any) {
      console.error('Error duplicating event:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to duplicate event";
      if (error.message?.includes('null value')) {
        errorMessage = "Database constraint error. Please try again.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "You don't have permission to duplicate this event";
      } else if (error.message) {
        errorMessage = `Failed to duplicate event: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsDuplicating(false);
    }
  };

  return {
    duplicateEvent,
    isDuplicating
  };
};
