
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useRequireAuth = (
  redirectTo = "/auth/signin",
  requiredUserType?: "host" | "attendee" | "both"
) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserType = async () => {
      if (!user) {
        // User not logged in, redirect to login
        navigate(`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`);
        return;
      }

      if (!requiredUserType) {
        // No specific user type required, just need to be logged in
        setIsAuthorized(true);
        return;
      }

      try {
        // Get user profile to check user_type
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", user.id)
          .single();

        if (!profile) {
          setIsAuthorized(false);
          navigate("/");
          return;
        }

        // Check if user has required user type
        if (
          requiredUserType === "both" ||
          profile.user_type === requiredUserType ||
          profile.user_type === "both"
        ) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        setIsAuthorized(false);
        navigate("/");
      }
    };

    if (!loading) {
      checkUserType();
    }
  }, [user, loading, navigate, redirectTo, requiredUserType, location.pathname]);

  return { isAuthorized, loading };
};
