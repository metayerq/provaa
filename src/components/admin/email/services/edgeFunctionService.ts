
export const edgeFunctionService = {
  async testFunctionAccess() {
    console.log('🔍 Testing edge function access...');
    try {
      const response = await fetch(`https://vsianzkmvbbaahoeivnx.supabase.co/functions/v1/create-email-templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaWFuemttdmJiYWFob2Vpdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTg2MDYsImV4cCI6MjA2MzU3NDYwNn0.wWx7pSYfUJTIMuSvBluxPDgqU8SuKuGI4TQTUOEAKh0`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      });
      
      console.log('🔍 Direct fetch response:', response.status, response.statusText);
      const text = await response.text();
      console.log('🔍 Direct fetch body:', text);
      
      return { status: response.status, body: text, success: response.ok };
    } catch (error: any) {
      console.error('🔍 Direct fetch error:', error);
      return { error: error.message, success: false };
    }
  },

  async testFunctionWithSupabaseClient(supabaseClient: any) {
    console.log('🔧 Testing with Supabase client...');
    try {
      const { data, error } = await supabaseClient.functions.invoke('create-email-templates', {
        body: { test: true }
      });
      
      console.log('🔧 Supabase client response:', { data, error });
      return { data, error, success: !error };
    } catch (error: any) {
      console.error('🔧 Supabase client error:', error);
      return { error: error.message, success: false };
    }
  }
};
