import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { EventForm } from '../form/types';

interface ExperienceDetailsStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const ExperienceDetailsStep: React.FC<ExperienceDetailsStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Enforce character limit for ambianceDescription
    if (name === 'ambianceDescription' && value.length > 500) {
      return; // Don't update if over limit
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const ambianceCharCount = formData.ambianceDescription?.length || 0;
  const isNearLimit = ambianceCharCount > 450;
  const isAtLimit = ambianceCharCount > 500;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Experience Details</h2>
      <p className="text-gray-600">Set the scene for your experience.</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="ambianceDescription">Ambiance & Setting Description*</Label>
          <Textarea
            id="ambianceDescription"
            name="ambianceDescription"
            placeholder="Describe the atmosphere and setting... e.g. Cozy wine cellar with exposed stone walls..."
            value={formData.ambianceDescription}
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
              Describe the atmosphere and setting to help guests visualize the experience
            </p>
            <span className={cn(
              "text-sm",
              isAtLimit ? "text-red-500 font-medium" : 
              isNearLimit ? "text-orange-500" : "text-gray-400"
            )}>
              {ambianceCharCount}/500
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !formData.date && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    "Select date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="time">Time*</Label>
            <div className="flex items-center border border-input rounded-md">
              <div className="px-3 py-2 bg-gray-50 border-r border-input">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="border-0"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="duration">Duration*</Label>
            <Input
              id="duration"
              name="duration"
              placeholder="e.g. 2 hours"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailsStep;
