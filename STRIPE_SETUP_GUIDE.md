# Stripe Payment Setup Guide

## Issue
The payment system is failing with "Booking failed, failed to send a request to the edge functions" because the Supabase Edge Functions don't have the required environment variables configured.

## Required Environment Variables

Your edge functions need these environment variables to work:

### 1. Stripe Keys
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_test_` or `pk_live_`)

### 2. Supabase Keys  
- `SUPABASE_URL` - https://vsianzkmvbbaahoeivnx.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (needed for edge functions)

## Step-by-Step Fix

### Step 1: Get Your Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → API keys
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

### Step 2: Get Your Supabase Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `vsianzkmvbbaahoeivnx`
3. Go to Settings → API
4. Copy the **service_role** key (very long string)

### Step 3: Set Environment Variables for Edge Functions

You have 3 options to set these:

#### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI first if you don't have it
npm install -g supabase

# Set the environment variables
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
supabase secrets set SUPABASE_URL=https://vsianzkmvbbaahoeivnx.supabase.co
```

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Edge Functions → Settings
3. Add these environment variables:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key  
   - `SUPABASE_URL` = https://vsianzkmvbbaahoeivnx.supabase.co

#### Option C: Create .env file for local development
Create a `.env.local` file in your project root:
```
VITE_SUPABASE_URL=https://vsianzkmvbbaahoeivnx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaWFuemttdmJiYWFob2Vpdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTg2MDYsImV4cCI6MjA2MzU3NDYwNn0.wWx7pSYfUJTIMuSvBluxPDgqU8SuKuGI4TQTUOEAKh0

# Add your Stripe keys here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Add your Supabase service role key here  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_URL=https://vsianzkmvbbaahoeivnx.supabase.co
```

### Step 4: Deploy Edge Functions (if using local development)
```bash
# Deploy the create-stripe-checkout function
supabase functions deploy create-stripe-checkout

# Deploy other payment-related functions
supabase functions deploy verify-stripe-payment
supabase functions deploy confirm-payment
```

### Step 5: Test the Payment System
1. Restart your development server
2. Try to book an event
3. Click "Pay with Stripe"
4. The payment should now work correctly

## Additional Troubleshooting

### If you still get errors:

1. **Check Edge Function Logs**:
   ```bash
   supabase functions logs create-stripe-checkout
   ```

2. **Test Environment Variables**:
   Make sure your environment variables are set correctly in the Supabase dashboard.

3. **Verify Stripe Webhook** (if using webhooks):
   - Go to Stripe Dashboard → Developers → Webhooks
   - Make sure your webhook endpoint is configured correctly

### Test Commands
```bash
# Test if Supabase CLI is working
supabase status

# Test edge function locally
supabase functions serve

# Check if secrets are set
supabase secrets list
```

## Security Notes
- Never commit your `.env.local` file to version control
- Use test keys for development
- Use live keys only for production
- The service role key is very powerful - keep it secure

## What Each Edge Function Does
- `create-stripe-checkout`: Creates Stripe checkout session and pending booking
- `verify-stripe-payment`: Verifies payment and confirms booking  
- `confirm-payment`: Confirms payment intent
- `process-stripe-refund`: Handles refunds

Once you complete these steps, your Stripe payments should work correctly! 