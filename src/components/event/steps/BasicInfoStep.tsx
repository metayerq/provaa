import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { EventForm } from '../form/types';
import { ImageUpload } from '../form/ImageUpload';

interface BasicInfoStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ 
  formData, 
  setFormData, 
  isEditing = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Enforce character limit for description
    if (name === 'description' && value.length > 500) {
      return; // Don't update if over limit
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const descriptionCharCount = formData.description?.length || 0;
  const isNearLimit = descriptionCharCount > 450;
  const isAtLimit = descriptionCharCount > 500;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
      <p className="text-gray-600">Start with the essentials about your experience.</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Experience Title*</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Wine Tasting with Local Bordeaux Selections"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Experience Description*</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what makes your experience special and what guests can expect..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            required
            className={cn(
              "resize-none",
              isAtLimit && "border-red-500 focus:border-red-500",
              isNearLimit && !isAtLimit && "border-orange-400 focus:border-orange-400"
            )}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              Tell guests what makes your experience unique and memorable
            </p>
            <span className={cn(
              "text-sm",
              isAtLimit ? "text-red-500 font-medium" : 
              isNearLimit ? "text-orange-500" : "text-gray-400"
            )}>
              {descriptionCharCount}/500
            </span>
          </div>
        </div>
        
        <div>
          <Label>Experience Image</Label>
          <ImageUpload
            value={formData.image}
            existingImageUrl={isEditing ? formData.existingImageUrl : undefined}
            onChange={(file) => setFormData(prev => ({ ...prev, image: file }))}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
