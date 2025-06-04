
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Eye } from 'lucide-react';
import { EventForm } from '../form/types';

interface SEOStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const SEOStep: React.FC<SEOStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSEOSuggestions = () => {
    const suggestedTitle = formData.title ? `${formData.title} | Provaa` : '';
    const suggestedDescription = formData.description ? 
      formData.description.substring(0, 150) + (formData.description.length > 150 ? '...' : '') :
      '';

    setFormData(prev => ({
      ...prev,
      metaTitle: prev.metaTitle || suggestedTitle,
      metaDescription: prev.metaDescription || suggestedDescription
    }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO Settings</h2>
          <p className="text-gray-600">Optimize how your event appears in search results and social media</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={generateSEOSuggestions}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Auto-generate
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              name="metaTitle"
              placeholder="e.g. Wine Tasting: Exploring Italian Reds | Provaa"
              value={formData.metaTitle}
              onChange={handleChange}
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.metaTitle.length}/60 characters - Appears in search results and browser tabs
            </p>
          </div>
          
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              placeholder="Describe what makes this event special..."
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.metaDescription.length}/160 characters - Appears in search results
            </p>
          </div>

          <div>
            <Label htmlFor="ogImageUrl">Custom Social Media Image URL</Label>
            <Input
              id="ogImageUrl"
              name="ogImageUrl"
              type="url"
              placeholder="https://example.com/event-image.jpg"
              value={formData.ogImageUrl}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Custom image for social media sharing (recommended: 1200x630px)
            </p>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4" />
                Search Result Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-white">
                <div className="text-sm text-gray-600">https://provaa.com/events/...</div>
                <div className="text-lg text-blue-600 font-medium truncate">
                  {formData.metaTitle || formData.title || "Your Event Title"}
                </div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {formData.metaDescription || formData.description || "Your event description will appear here..."}
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-xs text-gray-500 mb-2">Social Media Preview</div>
                <div className="bg-white rounded border">
                  <div className="h-32 bg-gray-200 rounded-t flex items-center justify-center relative">
                    {formData.ogImageUrl && (
                      <img 
                        src={formData.ogImageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-t"
                        onError={handleImageError}
                      />
                    )}
                    <div className="text-gray-400 text-sm">Event Image</div>
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm truncate">
                      {formData.metaTitle || formData.title || "Event Title"}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {formData.metaDescription || formData.description || "Event description..."}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">provaa.com</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SEOStep;
