
import { useEffect } from 'react';
import { EventForm } from '@/components/event/form/types';
import { useFormData } from '@/components/event/form/useFormData';

export const useEventFormInitialization = (event: any) => {
  const getInitialFormData = () => {
    if (!event) return undefined;
    
    console.log('🔄 Initializing form data from event:', {
      eventId: event.id,
      title: event.title,
      hasImage: !!event.image,
      hasProducts: !!event.products,
      productsCount: event.products?.length || 0
    });

    // Parse date properly
    let parsedDate = null;
    if (event.date) {
      try {
        parsedDate = new Date(event.date);
        console.log('📅 Parsed date:', parsedDate);
      } catch (error) {
        console.error('❌ Date parsing error:', error);
      }
    }

    // Ensure products array is properly initialized
    let productsArray = [];
    if (event.products && Array.isArray(event.products) && event.products.length > 0) {
      productsArray = event.products.map(p => ({
        name: p.name || '',
        producer: p.producer || '',
        year: p.year || '',
        type: p.type || ''
      }));
      console.log('📦 Products loaded:', productsArray);
    } else {
      // Default empty product if no products exist
      productsArray = [{ name: '', producer: '', year: '', type: '' }];
      console.log('📦 No products found, using default empty product');
    }

    return {
      title: event.title || '',
      description: event.description || '',
      category: event.category || '',
      date: parsedDate,
      time: event.time || '',
      duration: event.duration || '',
      capacity: event.capacity || 10,
      price: event.price || 0,
      image: null, // Always null for new uploads
      isOnline: event.location?.is_online || false,
      venueName: event.location?.venue_name || '',
      address: event.location?.address || '',
      city: event.location?.city || '',
      ambianceDescription: event.ambiance_description || '',
      products: productsArray,
      accessibilityInfo: event.accessibility_info || '',
      dressCode: event.dress_code || '',
      dietaryOptions: event.dietary_options || [],
      meetingPointDetails: event.meeting_point_details || '',
      cancellationPolicy: event.cancellation_policy || '',
      metaTitle: event.meta_title || '',
      metaDescription: event.meta_description || '',
      ogImageUrl: event.og_image_url || '',
      existingImageUrl: event.image || ''
    };
  };

  const { formData, setFormData } = useFormData(getInitialFormData());

  // Update form data when event changes
  useEffect(() => {
    if (event && (!formData.title || formData.title === '')) {
      console.log('🔄 Event data changed, updating form data');
      const newFormData = getInitialFormData();
      if (newFormData) {
        setFormData(newFormData);
        console.log('✅ Form data updated with event data');
      }
    }
  }, [event, setFormData]);

  return { formData, setFormData };
};
