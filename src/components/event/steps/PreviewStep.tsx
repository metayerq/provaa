import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { categories } from '@/utils/mockData';
import { EventForm } from '../form/types';
import { formatPrice } from '@/utils/priceUtils';

interface PreviewStepProps {
  formData: EventForm;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Experience Details</h2>
      <p className="text-gray-600">Please review your experience information before publishing.</p>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{formData.title || "Untitled Experience"}</h3>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <span className="text-lg">
                {categories.find(c => c.id === formData.category)?.emoji || "🍽️"}
              </span>
              {categories.find(c => c.id === formData.category)?.label || "Unknown Category"}
            </span>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
              {formData.date ? format(formData.date, "PPP") : "No date selected"}
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-2 text-emerald-600" />
              {formData.time || "No time"}, {formData.duration || "No duration"}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">{formData.description || "No description provided."}</p>
          </div>

          <div className="py-2 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Experience Details</h4>
            <p className="text-gray-600">{formData.ambianceDescription || "No experience details provided."}</p>
          </div>
          
          <div className="py-2 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
            {formData.isOnline ? (
              <p className="text-gray-600">Online Experience</p>
            ) : (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">{formData.venueName || "No venue specified"}</p>
                  <p className="text-gray-600">{formData.address || "No address"}, {formData.city || "No city"}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="py-2 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">What You'll Experience</h4>
            <div className="space-y-2">
              {formData.products.length > 0 && formData.products.some(p => p.name) ? (
                formData.products.map((product, index) => (
                  <div key={index}>
                    <p className="text-gray-900 font-medium">
                      {product.name || `Product ${index + 1}`}
                      {product.year && ` (${product.year})`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {product.producer}
                      {product.type && ` - ${product.type}`}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Experience details will be shared during the event</p>
              )}
            </div>
          </div>
          
          <div className="py-2 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Price & Capacity</h4>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Price per person</p>
              <p className="font-bold text-emerald-700">
                {formatPrice(formData.price, { currency: '$' })}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Maximum capacity</p>
              <p className="font-medium text-gray-900">{formData.capacity} people</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
