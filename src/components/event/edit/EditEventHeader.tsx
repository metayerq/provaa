
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import EventPreviewModal from './EventPreviewModal';
import CancelConfirmationModal from './CancelConfirmationModal';
import { EventForm } from '@/components/event/form/types';

interface EditEventHeaderProps {
  eventTitle: string;
  eventDate: string;
  bookingCount: number;
  eventCapacity: number;
  eventStatus?: 'live' | 'draft' | 'paused';
  isSaving: boolean;
  savingAsDraft: boolean;
  formData: EventForm;
  existingImageUrl?: string;
  onSave: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

const EditEventHeader: React.FC<EditEventHeaderProps> = ({
  eventTitle,
  eventDate,
  bookingCount,
  eventCapacity,
  eventStatus = 'live',
  isSaving,
  savingAsDraft,
  formData,
  existingImageUrl,
  onSave,
  onSaveAsDraft,
  onPublish,
  onCancel
}) => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    onCancel();
  };

  const getStatusText = () => {
    switch (eventStatus) {
      case 'live': return 'Live';
      case 'draft': return 'Draft';
      case 'paused': return 'Paused';
      default: return 'Live';
    }
  };

  const renderActionButtons = () => {
    const commonButtons = [
      <Button 
        key="preview"
        variant="outline" 
        size="sm"
        onClick={() => setShowPreview(true)}
      >
        <Eye className="h-4 w-4 mr-2" />
        Preview
      </Button>
    ];

    if (eventStatus === 'live') {
      return [
        ...commonButtons,
        <Button 
          key="save"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      ];
    }

    if (eventStatus === 'draft') {
      return [
        ...commonButtons,
        <Button 
          key="save-draft"
          variant="outline"
          size="sm"
          onClick={onSaveAsDraft}
          disabled={isSaving}
        >
          {savingAsDraft ? 'Saving...' : 'Save as Draft'}
        </Button>,
        <Button 
          key="publish"
          size="sm"
          onClick={onPublish}
          disabled={isSaving}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving && !savingAsDraft ? 'Publishing...' : 'Publish'}
        </Button>
      ];
    }

    if (eventStatus === 'paused') {
      return [
        ...commonButtons,
        <Button 
          key="save"
          variant="outline"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>,
        <Button 
          key="publish"
          size="sm"
          onClick={onPublish}
          disabled={isSaving}
          className="bg-emerald-700 hover:bg-emerald-800"
        >
          {isSaving ? 'Publishing...' : 'Publish'}
        </Button>
      ];
    }

    return commonButtons;
  };

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 text-gray-500 hover:text-gray-700"
          onClick={() => navigate('/host/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Events
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editing: {eventTitle}
            </h1>
            <p className="text-gray-600">
              Status: {getStatusText()} • Created: {new Date(eventDate).toLocaleDateString()} • {bookingCount}/{eventCapacity} spots booked
            </p>
          </div>
          
          <div className="flex gap-2">
            {renderActionButtons()}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <EventPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={formData}
        existingImageUrl={existingImageUrl}
      />

      <CancelConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
};

export default EditEventHeader;
