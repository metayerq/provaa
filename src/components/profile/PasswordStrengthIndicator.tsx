
import { useState, useEffect } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!password) {
      setStrength(0);
      return;
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    
    // Number check
    if (/[0-9]/.test(password)) score += 1;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength(score);
  }, [password]);

  const getColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getLabel = () => {
    if (strength === 0) return "Empty";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getWidth = () => {
    if (strength === 0) return "w-0";
    if (strength === 1) return "w-1/4";
    if (strength === 2) return "w-2/4";
    if (strength === 3) return "w-3/4";
    return "w-full";
  };

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${getWidth()} ${getColor()} transition-all duration-300`}></div>
      </div>
      <div className="flex justify-between text-xs">
        <span>Strength: {getLabel()}</span>
      </div>
      <ul className="text-xs space-y-1 text-gray-600">
        <li className={password.length >= 8 ? "text-green-600" : ""}>
          ✓ At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
          ✓ One uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
          ✓ One number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>
          ✓ One special character
        </li>
      </ul>
    </div>
  );
}
