
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AuthButtonsProps {
  isMobile?: boolean;
}

const AuthButtons = ({ isMobile = false }: AuthButtonsProps) => {
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="pt-4 border-t border-gray-700 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mb-2 text-white border-white hover:bg-white hover:text-black" 
          onClick={() => navigate('/auth/signin')}
        >
          Login
        </Button>
        <Button 
          size="sm" 
          className="w-full bg-white text-black hover:bg-gray-200" 
          onClick={() => navigate('/auth/signup')}
        >
          Join the Community
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-white border-white bg-transparent hover:bg-white hover:text-black transition-all duration-200 font-medium text-sm uppercase tracking-wide"
        onClick={() => navigate('/auth/signin')}
      >
        LOGIN / SIGN UP
      </Button>
    </div>
  );
};

export default AuthButtons;
