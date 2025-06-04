import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { EventForm } from '../form/types';
import { formatPrice } from '@/utils/priceUtils';

interface PricingStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const PricingStep: React.FC<PricingStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  const displayPrice = formatPrice(formData.price, { currency: '$' });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
      <p className="text-gray-600">Set your event price per person.</p>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="price">Price per Person*</Label>
            <span className="font-semibold text-emerald-700">{displayPrice}</span>
          </div>
          <Slider
            id="price"
            min={0}
            max={200}
            step={1}
            value={[formData.price]}
            onValueChange={(value) => setFormData(prev => ({ ...prev, price: value[0] }))}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Free</span>
            <span>$200</span>
          </div>
          {formData.price === 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Free events allow participants to cancel at any time without fees.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingStep;
