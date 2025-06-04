
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: { full_name: string; user_type: string; phone?: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const initialSetupComplete = useRef(false);

  const refreshSession = async () => {
    console.log('🔄 Refreshing auth session...');
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('❌ Session refresh error:', error);
        return;
      }
      
      console.log('✅ Session refreshed successfully');
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error('❌ Session refresh failed:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 AuthContext: Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('🔔 Auth state change:', event, newSession ? 'Session exists' : 'No session');
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Only show success toast for actual sign-ins after initial setup is complete
        if (event === 'SIGNED_IN' && initialSetupComplete.current) {
          console.log('✅ User signed in:', newSession?.user?.email);
          toast({
            title: "Signed in successfully",
            description: "Welcome back to Tastee!",
          });
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        } else {
          console.log('📍 Initial session check:', currentSession ? 'Found session' : 'No session');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setLoading(false);
        initialSetupComplete.current = true;
        console.log('✅ Auth initialization complete');
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast]);

  const signUp = async (email: string, password: string, metadata: { full_name: string; user_type: string; phone?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          user_type: metadata.user_type,
          phone: metadata.phone
        },
      },
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
