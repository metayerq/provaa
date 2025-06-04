import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { EventForm } from '../form/types';

interface PracticalDetailsStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const PracticalDetailsStep: React.FC<PracticalDetailsStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  const dietaryOptionsAvailable = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Halal', 'Kosher'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayFieldChange = (field: 'dietaryOptions', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Practical Details</h2>
      <p className="text-gray-600">Provide important details for your guests.</p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="venueName">Venue Name*</Label>
          <Input
            id="venueName"
            name="venueName"
            placeholder="e.g. The Wine Cellar"
            value={formData.venueName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="address">Address*</Label>
          <div className="flex items-center border border-input rounded-md">
            <div className="px-3 py-2 bg-gray-50 border-r border-input">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              id="address"
              name="address"
              placeholder="Street address"
              value={formData.address}
              onChange={handleChange}
              className="border-0"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            name="city"
            placeholder="e.g. Portland"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="meetingPointDetails">Meeting Point Details</Label>
          <Textarea
            id="meetingPointDetails"
            name="meetingPointDetails"
            placeholder="Specific instructions on where to meet, building entrance, parking info, etc."
            value={formData.meetingPointDetails}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="accessibilityInfo">Accessibility</Label>
          <Select 
            value={formData.accessibilityInfo} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, accessibilityInfo: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select accessibility level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ground floor">Ground floor access</SelectItem>
              <SelectItem value="Stairs required">Stairs required</SelectItem>
              <SelectItem value="Elevator available">Elevator available</SelectItem>
              <SelectItem value="Wheelchair accessible">Wheelchair accessible</SelectItem>
              <SelectItem value="Limited mobility">Limited mobility friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dressCode">Dress Code (Optional)</Label>
          <Input
            id="dressCode"
            name="dressCode"
            placeholder="e.g. Smart casual, no specific requirements"
            value={formData.dressCode}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Dietary Options Available</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {dietaryOptionsAvailable.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`dietary-${option}`}
                  checked={formData.dietaryOptions.includes(option)}
                  onCheckedChange={(checked) => 
                    handleArrayFieldChange('dietaryOptions', option, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`dietary-${option}`}
                  className="text-sm font-normal"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
          <Select 
            value={formData.cancellationPolicy} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, cancellationPolicy: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cancellation policy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 hours notice</SelectItem>
              <SelectItem value="48h">48 hours notice</SelectItem>
              <SelectItem value="72h">72 hours notice</SelectItem>
              <SelectItem value="1week">1 week notice</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PracticalDetailsStep;
