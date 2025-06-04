
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { TestResult } from './types.ts';

export async function testConfirmationEmail(supabase: SupabaseClient): Promise<TestResult> {
  console.log('📧 Testing booking confirmation email');
  
  // Find a recent booking to test with
  const { data: recentBooking } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!recentBooking) {
    return {
      type: 'confirmation',
      error: 'No confirmed bookings found'
    };
  }

  console.log('📧 Testing booking confirmation email for booking:', recentBooking.booking_reference);
  
  const emailResponse = await supabase.functions.invoke('send-booking-confirmation', {
    body: { bookingId: recentBooking.id }
  });
  
  return {
    type: 'confirmation',
    bookingRef: recentBooking.booking_reference,
    response: emailResponse.data,
    error: emailResponse.error
  };
}
