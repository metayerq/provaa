// Test Stripe Setup - Run this in browser console or as a script
async function testStripeSetup() {
  console.log('🧪 Testing Stripe Setup...');
  
  // Check if environment variables are loaded
  console.log('Environment check:');
  console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('- VITE_STRIPE_PUBLISHABLE_KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing');
  
  // Test Supabase connection
  try {
    const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    console.log('📡 Supabase connection:', response.ok ? '✅ Connected' : '❌ Failed');
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
  }
  
  // Test Edge Function endpoint
  try {
    const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/functions/v1/create-stripe-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        eventId: 'test',
        numberOfTickets: 1,
        pricePerTicket: 50,
        totalAmount: 52.5,
        guestInfo: {
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    });
    
    const result = await response.text();
    console.log('🔧 Edge Function test:', response.ok ? '✅ Responding' : '❌ Error');
    console.log('Response:', result);
  } catch (error) {
    console.error('❌ Edge Function error:', error);
  }
}

// Copy and paste this into browser console to test:
console.log('🧪 Stripe Test Script Ready - Call testStripeSetup() to run');

export { testStripeSetup }; 