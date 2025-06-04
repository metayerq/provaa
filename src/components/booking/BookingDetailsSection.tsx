
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BookingFormValues } from './schemas/bookingSchemas';

interface BookingDetailsSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export const BookingDetailsSection: React.FC<BookingDetailsSectionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="dietaryRestrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dietary Restrictions (optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Please list any dietary restrictions or allergies" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests (optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any special requests or accommodations needed?" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
