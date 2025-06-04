
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { PreferencesFormValues } from "./types";

interface EmailNotificationsSectionProps {
  onEmailNotificationChange: (field: keyof PreferencesFormValues['emailNotifications'], value: boolean) => void;
}

export function EmailNotificationsSection({ onEmailNotificationChange }: EmailNotificationsSectionProps) {
  const form = useFormContext<PreferencesFormValues>();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="emailNotifications.reminders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onEmailNotificationChange('reminders', !!checked);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Event reminders</FormLabel>
                <FormDescription>
                  Get notified 24 hours before your booked events
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emailNotifications.newEvents"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onEmailNotificationChange('newEvents', !!checked);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>New events in my area</FormLabel>
                <FormDescription>
                  Get notified about new events near your location
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emailNotifications.marketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onEmailNotificationChange('marketing', !!checked);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Marketing emails</FormLabel>
                <FormDescription>
                  Receive offers, promotions and news from Tastee
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
