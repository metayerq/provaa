
import { supabase } from '@/integrations/supabase/client';

export const useAuthRestoration = () => {
  const restoreAuthSession = async (): Promise<boolean> => {
    // First, check if user is already authenticated
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      console.log('✅ User already authenticated:', currentSession.user.email);
      return true;
    }

    // Try to restore authentication state - enhanced for mobile
    try {
      const storedSession = localStorage.getItem('stripe_checkout_session');
      const authBackup = sessionStorage.getItem('stripe_auth_backup');
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      
      if (storedSession) {
        console.log('🔑 Found stored session, attempting to restore auth for mobile...');
        const sessionData = JSON.parse(storedSession);
        
        // More lenient timeout for mobile (2 hours instead of 1)
        if (Date.now() - sessionData.timestamp < 2 * 60 * 60 * 1000) {
          const { error } = await supabase.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token
          });
          
          if (error) {
            console.error('❌ Failed to restore session:', error);
            return false;
          } else {
            console.log('✅ Successfully restored authentication session');
            return true;
          }
        } else {
          console.log('⚠️ Stored session too old, discarding');
        }
        
        // Clean up stored session data
        localStorage.removeItem('stripe_checkout_session');
      } else if (authBackup) {
        console.log('🔑 Found auth backup for mobile user');
        const backupData = JSON.parse(authBackup);
        console.log('📧 Backup user email:', backupData.userEmail);
      }

      if (pendingBooking) {
        console.log('📋 Found pending booking data:', JSON.parse(pendingBooking));
      }
    } catch (error) {
      console.error('❌ Error restoring auth session:', error);
    }

    return false;
  };

  const cleanupSessionData = () => {
    sessionStorage.removeItem('pendingBooking');
    sessionStorage.removeItem('stripe_auth_backup');
  };

  return {
    restoreAuthSession,
    cleanupSessionData
  };
};
