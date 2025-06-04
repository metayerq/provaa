import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventForm } from './types';
import EventTypeStep from '../steps/EventTypeStep';
import BasicInfoStep from '../steps/BasicInfoStep';
import ExperienceDetailsStep from '../steps/ExperienceDetailsStep';
import ProductsStep from '../steps/ProductsStep';
import PracticalDetailsStep from '../steps/PracticalDetailsStep';
import PricingStep from '../steps/PricingStep';

interface EditingModeFormProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isSubmitting: boolean;
  savingAsDraft: boolean;
  onSubmit: (isDraft?: boolean) => Promise<void>;
}

const EditingModeForm: React.FC<EditingModeFormProps> = ({
  formData,
  setFormData,
  isSubmitting,
  savingAsDraft,
  onSubmit
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const renderTabContent = (tabId: string) => {
    const stepProps = {
      formData,
      setFormData,
      isEditing: true
    };

    switch (tabId) {
      case 'basic':
        return <BasicInfoStep {...stepProps} />;
      case 'type':
        return <EventTypeStep {...stepProps} />;
      case 'experience':
        return <ExperienceDetailsStep {...stepProps} />;
      case 'products':
        return <ProductsStep {...stepProps} />;
      case 'practical':
        return <PracticalDetailsStep {...stepProps} />;
      case 'pricing':
        return <PricingStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="type">Category</TabsTrigger>
          <TabsTrigger value="experience">Details</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="practical">Practical</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {['basic', 'type', 'experience', 'products', 'practical', 'pricing'].map((tabId) => (
          <TabsContent key={tabId} value={tabId} className="mt-6">
            <div className="bg-gray-50 rounded-xl p-6 md:p-8">
              {renderTabContent(tabId)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default EditingModeForm;
