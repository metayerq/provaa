
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface CreateAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAutomationCreated: (automation: any) => void;
}

export const CreateAutomationDialog: React.FC<CreateAutomationDialogProps> = ({
  open,
  onOpenChange,
  onAutomationCreated,
}) => {
  const [formData, setFormData] = useState({
    trigger: '',
    template: '',
    timing: '',
    recipients: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAutomation = {
        id: Date.now().toString(),
        trigger: formData.trigger,
        template: formData.template,
        timing: formData.timing,
        recipients: formData.recipients,
        status: 'Draft' as const,
      };

      onAutomationCreated(newAutomation);
      toast({
        title: "Automation Rule Created",
        description: `Automation rule for "${formData.trigger}" has been created successfully.`,
      });
      
      setFormData({ trigger: '', template: '', timing: '', recipients: '' });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create automation rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Automation Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trigger">Trigger Event</Label>
            <Select
              value={formData.trigger}
              onValueChange={(value) => setFormData({ ...formData, trigger: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trigger event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Booking Confirmed">Booking Confirmed</SelectItem>
                <SelectItem value="Event in 24h">Event in 24h</SelectItem>
                <SelectItem value="Event in 2h">Event in 2h</SelectItem>
                <SelectItem value="Host Verified">Host Verified</SelectItem>
                <SelectItem value="Event Cancelled">Event Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="template">Email Template</Label>
            <Select
              value={formData.template}
              onValueChange={(value) => setFormData({ ...formData, template: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select email template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Booking Confirmation">Booking Confirmation</SelectItem>
                <SelectItem value="Event Reminder">Event Reminder</SelectItem>
                <SelectItem value="Last Minute Reminder">Last Minute Reminder</SelectItem>
                <SelectItem value="Welcome Host">Welcome Host</SelectItem>
                <SelectItem value="Cancellation Notice">Cancellation Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timing">Timing</Label>
            <Select
              value={formData.timing}
              onValueChange={(value) => setFormData({ ...formData, timing: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Immediate">Immediate</SelectItem>
                <SelectItem value="24h before">24h before</SelectItem>
                <SelectItem value="2h before">2h before</SelectItem>
                <SelectItem value="1h before">1h before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <Input
              id="recipients"
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              placeholder="e.g., Guest, All attendees, New Host"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
