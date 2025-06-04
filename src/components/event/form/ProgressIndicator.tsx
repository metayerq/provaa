import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 0, name: 'Category', emoji: '🏷️' },
    { id: 1, name: 'Basic Info', emoji: '📝' },
    { id: 2, name: 'Experience', emoji: '✨' },
    { id: 3, name: 'Products', emoji: '🍷' },
    { id: 4, name: 'Practical', emoji: '📍' },
    { id: 5, name: 'Pricing', emoji: '💰' },
    { id: 6, name: 'Preview', emoji: '👁️' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
              currentStep >= step.id 
                ? 'bg-emerald-700 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              <span className="text-lg">{step.emoji}</span>
            </div>
            <div className="ml-2 hidden md:block">
              <div className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-emerald-700' : 'text-gray-500'
              }`}>
                {step.name}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${
                currentStep > step.id ? 'bg-emerald-700' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
