
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CreateEventForm from '@/components/event/CreateEventForm';
import { EventForm } from '@/components/event/form/types';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Handle image upload
  const uploadImage = async (file: File, eventId: string): Promise<string | null> => {
    try {
      console.log('Starting image upload for event:', eventId);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });

      const fileExt = file.name.split('.').pop();
      const fileName = `${eventId}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading image:', filePath);

      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Image upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (formData: EventForm, isDraft: boolean = false) => {
    console.log('Form submission started:', {
      hasImage: !!formData.image,
      imageSize: formData.image?.size,
      imageName: formData.image?.name,
      isDraft
    });

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an event.",
        variant: "destructive"
      });
      navigate('/auth/signin');
      return;
    }

    try {
      // Transform form data for database insertion
      const eventData = {
        title: formData.title,
        description: formData.description,
        ambiance_description: formData.ambianceDescription,
        category: formData.category,
        date: formData.date ? format(formData.date, 'yyyy-MM-dd') : '',
        time: formData.time,
        duration: formData.duration,
        price: formData.price,
        capacity: formData.capacity,
        spots_left: formData.capacity,
        host_id: user.id,
        location: formData.isOnline 
          ? { type: 'online', isOnline: true }
          : {
              type: 'physical',
              isOnline: false,
              venueName: formData.venueName,
              address: formData.address,
              city: formData.city
            },
        products: formData.products.map(product => ({
          name: product.name,
          producer: product.producer,
          year: product.year,
          type: product.type
        })),
        accessibility_info: formData.accessibilityInfo,
        dress_code: formData.dressCode,
        dietary_options: formData.dietaryOptions,
        meeting_point_details: formData.meetingPointDetails,
        cancellation_policy: formData.cancellationPolicy,
        image: null // Will be updated after upload
      };

      console.log('Submitting event data:', eventData);

      // Insert event first
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Event created successfully:', data);

      // Upload image if provided
      let imageUrl = null;
      if (formData.image) {
        console.log('Uploading image for event:', data.id);
        imageUrl = await uploadImage(formData.image, data.id);
        
        if (imageUrl) {
          console.log('Updating event with image URL:', imageUrl);
          // Update event with image URL
          const { error: updateError } = await supabase
            .from('events')
            .update({ image: imageUrl })
            .eq('id', data.id);

          if (updateError) {
            console.error('Error updating event with image:', updateError);
            toast({
              title: "Image Upload Warning",
              description: "Event created successfully, but there was an issue saving the image.",
              variant: "destructive"
            });
          } else {
            console.log('Event image updated successfully');
          }
        } else {
          toast({
            title: "Image Upload Failed",
            description: "Event created successfully, but the image could not be uploaded.",
            variant: "destructive"
          });
        }
      } else {
        console.log('No image to upload');
      }
      
      toast({
        title: isDraft ? "Event Saved as Draft" : "Event Created Successfully",
        description: isDraft 
          ? "Your event has been saved as a draft." 
          : "Your event is now live and can be found in the events listing.",
      });
      
      // Navigate to host events page after short delay
      setTimeout(() => {
        navigate('/host/events');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating event:', error);
      
      toast({
        title: "Error Creating Event",
        description: error.message || "There was an error creating your event. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-500 hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Experience</h1>
        <p className="text-gray-600 mb-8">Share your expertise and connect with enthusiasts</p>
        
        <CreateEventForm onSave={handleSubmit} />
        
        {/* Help text */}
        <div className="text-center text-sm text-gray-500">
          <p>Need help creating your experience? Check out our <a href="#" className="text-emerald-700 hover:underline">hosting guidelines</a>.</p>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEventPage;
