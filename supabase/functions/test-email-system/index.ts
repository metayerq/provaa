
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { testConfirmationEmail } from './confirmation-tester.ts';
import { testReminderEmail } from './reminder-tester.ts';
import { testUpdateEmail } from './update-tester.ts';
import { TestResult } from './types.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { testType } = await req.json();
    console.log('🧪 Testing email system, type:', testType);

    let result: TestResult;

    switch (testType) {
      case 'confirmation':
        result = await testConfirmationEmail(supabase);
        break;

      case 'reminder':
        result = await testReminderEmail(supabase);
        break;

      case 'update':
        result = await testUpdateEmail(supabase);
        break;

      default:
        throw new Error('Invalid test type. Use: confirmation, reminder, or update');
    }

    console.log('✅ Test completed:', result);

    return new Response(
      JSON.stringify({ 
        success: true,
        result
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('❌ Email test error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
