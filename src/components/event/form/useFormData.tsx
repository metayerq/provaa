
import { useState } from 'react';
import { EventForm } from './types';

export const useFormData = (initialData?: Partial<EventForm>) => {
  const [formData, setFormData] = useState<EventForm>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    date: initialData?.date || null,
    time: initialData?.time || '',
    duration: initialData?.duration || '',
    capacity: initialData?.capacity || 10,
    price: initialData?.price || 0,
    image: initialData?.image || null,
    isOnline: initialData?.isOnline || false,
    venueName: initialData?.venueName || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    ambianceDescription: initialData?.ambianceDescription || '',
    products: initialData?.products || [{ name: '', producer: '', year: '', type: '' }],
    // Additional practical details fields
    accessibilityInfo: initialData?.accessibilityInfo || '',
    dressCode: initialData?.dressCode || '',
    dietaryOptions: initialData?.dietaryOptions || [],
    meetingPointDetails: initialData?.meetingPointDetails || '',
    cancellationPolicy: initialData?.cancellationPolicy || '',
    // SEO fields
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    ogImageUrl: initialData?.ogImageUrl || '',
    // Handle existing image URL for edit mode
    existingImageUrl: initialData?.existingImageUrl || '',
  });

  return { formData, setFormData };
};
