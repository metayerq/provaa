
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestResultData {
  type: string;
  mode?: string;
  bookingRef?: string;
  eventTitle?: string;
  eventDate?: string;
  eventDetails?: string;
  response?: any;
  simulationNote?: string;
  error?: any;
}

interface TestResult {
  id: number;
  type: string;
  timestamp: string;
  success: boolean;
  data: TestResultData;
}

export const useEmailTesting = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [lastTestTime, setLastTestTime] = useState<number>(0);

  const runEmailTest = async (testType: 'confirmation' | 'reminder' | 'update') => {
    // Rate limiting: prevent tests within 3 seconds of each other
    const now = Date.now();
    if (now - lastTestTime < 3000) {
      toast({
        title: 'Please Wait',
        description: 'Please wait a few seconds between tests to avoid rate limiting.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLastTestTime(now);

    try {
      console.log(`🧪 Running ${testType} email test...`);
      
      const { data, error } = await supabase.functions.invoke('test-email-system', {
        body: { testType }
      });

      if (error) {
        throw error;
      }

      const newResult: TestResult = {
        id: Date.now(),
        type: testType,
        timestamp: new Date().toLocaleString(),
        success: !data.result.error,
        data: data.result
      };

      setTestResults(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results

      if (data.result.error) {
        handleTestError(data.result.error, testType);
      } else {
        handleTestSuccess(data.result, testType);
      }
    } catch (error: any) {
      console.error(`❌ ${testType} email test failed:`, error);
      handleCatchError(error, testType);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestError = (error: any, testType: string) => {
    let errorMessage = 'Unknown error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = error.message || error.name || JSON.stringify(error);
    }
    
    // Provide helpful error messages
    if (errorMessage.includes && errorMessage.includes('domain is not verified')) {
      errorMessage = 'Domain verification issue. Please verify the provaa.co domain in your Resend dashboard.';
    } else if (errorMessage.includes && errorMessage.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please wait before sending more test emails.';
    } else if (errorMessage.includes && errorMessage.includes('No confirmed bookings found')) {
      errorMessage = 'No confirmed bookings found to test with. Please create a test booking first.';
    }

    toast({
      title: `${testType} Email Test Failed`,
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const handleTestSuccess = (result: TestResultData, testType: string) => {
    let successMessage = 'Email test completed successfully';
    
    if (testType === 'confirmation') {
      successMessage = 'Booking confirmation email sent using real booking data';
    } else if (testType === 'reminder') {
      if (result.mode === 'real') {
        successMessage = `Event reminder test completed - ${result.response?.sent || 0} real emails sent`;
      } else {
        successMessage = `Event reminder system verified - ${result.simulationNote || 'simulation completed'}`;
      }
    } else if (testType === 'update') {
      if (result.mode === 'real') {
        successMessage = `Event update test completed - ${result.response?.sent || 0} real emails sent`;
      } else {
        successMessage = `Event update system verified - ${result.simulationNote || 'simulation completed'}`;
      }
    }

    toast({
      title: `${testType} Email Test Successful`,
      description: successMessage,
    });
  };

  const handleCatchError = (error: any, testType: string) => {
    let errorMessage = 'Unknown error occurred';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = error.message || error.name || 'Email service error';
    }
    
    if (errorMessage.includes && errorMessage.includes('Function returned an error')) {
      errorMessage = 'Email service configuration error. Please check your Resend setup.';
    }

    toast({
      title: 'Email Test Failed',
      description: errorMessage,
      variant: 'destructive',
    });

    const newResult: TestResult = {
      id: Date.now(),
      type: testType,
      timestamp: new Date().toLocaleString(),
      success: false,
      data: { error: errorMessage, type: testType }
    };

    setTestResults(prev => [newResult, ...prev.slice(0, 9)]);
  };

  return {
    isLoading,
    testResults,
    runEmailTest
  };
};
