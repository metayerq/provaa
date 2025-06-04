
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookingFormValues } from './schemas/bookingSchemas';

interface TicketSelectorProps {
  form: UseFormReturn<BookingFormValues>;
  spotsLeft: number;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({ form, spotsLeft }) => {
  return (
    <FormField
      control={form.control}
      name="numberOfTickets"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Number of Tickets</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min={1} 
              max={spotsLeft} 
              {...field}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > spotsLeft) {
                  field.onChange(spotsLeft);
                } else if (value < 1) {
                  field.onChange(1);
                } else {
                  field.onChange(value);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
