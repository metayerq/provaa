#!/usr/bin/env node

/**
 * Payment Setup Test Script
 * 
 * This script helps diagnose payment setup issues by checking:
 * 1. Environment variables
 * 2. Supabase connection
 * 3. Edge function accessibility
 */

import { createClient } from '@supabase/supabase-js';

// Your current Supabase configuration
const SUPABASE_URL = 'https://vsianzkmvbbaahoeivnx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaWFuemttdmJiYWFob2Vpdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTg2MDYsImV4cCI6MjA2MzU3NDYwNn0.wWx7pSYfUJTIMuSvBluxPDgqU8SuKuGI4TQTUOEAKh0';

async function testPaymentSetup() {
  console.log('🔍 Testing Payment Setup...\n');

  // Initialize Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 1: Check Supabase connection
  console.log('1️⃣ Testing Supabase connection...');
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err) {
    console.log('❌ Supabase connection error:', err.message);
  }

  // Test 2: Test edge function accessibility
  console.log('\n2️⃣ Testing edge function accessibility...');
  try {
    const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
      body: {
        test: true,
        eventId: 'test-event-id',
        numberOfTickets: 1,
        pricePerTicket: 10,
        totalAmount: 10,
        guestInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890'
        }
      }
    });

    if (error) {
      console.log('❌ Edge function call failed:', error.message);
      
      // Check specific error types
      if (error.message.includes('Failed to fetch')) {
        console.log('💡 This likely means edge functions are not deployed or accessible');
      } else if (error.message.includes('STRIPE_SECRET_KEY')) {
        console.log('💡 Stripe secret key is missing from edge function environment');
      } else if (error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        console.log('💡 Supabase service role key is missing from edge function environment');
      }
    } else {
      console.log('✅ Edge function accessible (may still need proper environment variables)');
    }
  } catch (err) {
    console.log('❌ Edge function test error:', err.message);
  }

  // Test 3: Check environment variables guidance
  console.log('\n3️⃣ Environment Variables Checklist:');
  console.log('📋 Required environment variables for edge functions:');
  console.log('   - STRIPE_SECRET_KEY (sk_test_... or sk_live_...)');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (very long string from Supabase dashboard)');
  console.log('   - SUPABASE_URL (already correct: https://vsianzkmvbbaahoeivnx.supabase.co)');

  console.log('\n🔧 How to fix:');
  console.log('1. Get your Stripe keys from: https://dashboard.stripe.com/apikeys');
  console.log('2. Get your Supabase service role key from: https://supabase.com/dashboard → Settings → API');
  console.log('3. Set them using one of these methods:');
  console.log('   - Supabase CLI: supabase secrets set STRIPE_SECRET_KEY=your_key_here');
  console.log('   - Supabase Dashboard: Edge Functions → Settings → Environment Variables');
  console.log('   - Local development: Create .env.local file in project root');

  console.log('\n📖 For detailed instructions, see: STRIPE_SETUP_GUIDE.md');
}

// Run the test
testPaymentSetup().catch(console.error); 