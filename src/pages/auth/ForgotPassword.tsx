import React from 'react';
import { Navigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  // Redirect to reset password page since we don't have a separate forgot password flow
  return <Navigate to="/auth/reset-password" replace />;
};

export default ForgotPassword; 