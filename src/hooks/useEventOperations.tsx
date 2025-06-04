import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useEventOperations = () => {
  const [isUpdatingCapacity, setIsUpdatingCapacity] = useState(false);

  const handleCapacityChange = async (newCapacity: number, event: any, id: string, setEvent: any, setFormData: any) => {
    if (!event || !id) {
      console.error('❌ Missing event or ID for capacity update');
      return;
    }

    console.log('🔄 useEventOperations: Starting capacity update', {
      eventId: id,
      currentCapacity: event.capacity,
      newCapacity,
      eventObject: event
    });

    setIsUpdatingCapacity(true);

    try {
      // First, check current bookings to ensure capacity isn't reduced below confirmed bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('number_of_tickets')
        .eq('event_id', id)
        .eq('status', 'confirmed');

      if (bookingsError) {
        console.error('❌ Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      const totalBookedSpots = bookingsData?.reduce((sum, booking) => sum + (booking.number_of_tickets || 1), 0) || 0;
      console.log('📊 Booking validation:', { totalBookedSpots, newCapacity, canProceed: newCapacity >= totalBookedSpots });
      
      if (newCapacity < totalBookedSpots) {
        throw new Error(`Cannot reduce capacity below ${totalBookedSpots} (current confirmed bookings)`);
      }

      // Use the existing RPC function to update capacity
      console.log('🔧 Calling RPC function update_event_capacity...');
      const { data: rpcData, error: rpcError } = await supabase.rpc('update_event_capacity', {
        event_id: id,
        new_capacity: newCapacity
      });

      if (rpcError) {
        console.error('❌ RPC function error:', {
          error: rpcError,
          message: rpcError.message,
          details: rpcError.details,
          hint: rpcError.hint,
          code: rpcError.code
        });
        throw rpcError;
      }

      console.log('✅ RPC function executed successfully:', rpcData);

      // Verify the update by fetching the event again
      console.log('🔍 Verifying database update...');
      const { data: updatedEvent, error: fetchError } = await supabase
        .from('events')
        .select('capacity, spots_left')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching updated event:', fetchError);
        throw fetchError;
      }

      console.log('✅ Database verification:', {
        oldCapacity: event.capacity,
        newCapacityFromDB: updatedEvent.capacity,
        spotsLeft: updatedEvent.spots_left,
        updateSuccessful: updatedEvent.capacity === newCapacity
      });

      // Update local event state with verified data from database
      setEvent(prev => {
        if (!prev) return null;
        const updated = { 
          ...prev, 
          capacity: updatedEvent.capacity,
          spots_left: updatedEvent.spots_left
        };
        console.log('🔄 Updated event state:', { 
          oldCapacity: prev.capacity, 
          newCapacity: updated.capacity,
          spotsLeft: updated.spots_left 
        });
        return updated;
      });

      // Update form data state
      setFormData(prev => {
        const updated = { ...prev, capacity: updatedEvent.capacity };
        console.log('🔄 Updated form data:', { oldCapacity: prev.capacity, newCapacity: updated.capacity });
        return updated;
      });

      toast.success(`Capacity updated to ${newCapacity}`);
      console.log('✅ Capacity update completed successfully');
    } catch (error: any) {
      console.error('❌ Error updating capacity:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error(error.message || "Failed to update capacity");
      throw error; // Re-throw so CapacityManager can handle rollback
    } finally {
      setIsUpdatingCapacity(false);
    }
  };

  const handleStatusChange = async (status: 'live' | 'paused' | 'cancelled', event: any, id: string, setEvent: any) => {
    if (!event || !id) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setEvent(prev => prev ? { ...prev, status } : null);

      toast.success(`Event status changed to ${status}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || "Failed to update status");
    }
  };

  return {
    handleCapacityChange,
    handleStatusChange,
    isUpdatingCapacity
  };
};
