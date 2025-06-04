
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "host" | "attendee" | "both";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If no specific role is required, just return the children
  if (!requiredUserType) {
    return <>{children}</>;
  }

  // Here we would check if the user has the required role
  // This would typically involve fetching the user's profile from the database
  // For now, we'll just return the children
  // In a real app, you would check the user's role and redirect if necessary

  return <>{children}</>;
};

export default ProtectedRoute;
