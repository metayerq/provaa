
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookingFormValues } from './schemas/bookingSchemas';

interface GuestCheckoutSectionProps {
  form: UseFormReturn<BookingFormValues>;
}

export const GuestCheckoutSection: React.FC<GuestCheckoutSectionProps> = ({ form }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
      <h3 className="text-sm font-medium text-amber-800 mb-1">Guest Checkout</h3>
      <p className="text-xs text-amber-700 mb-2">
        Please provide your contact information or{" "}
        <Button 
          variant="link" 
          className="h-auto p-0 text-xs text-amber-800 font-medium underline" 
          onClick={() => navigate("/auth/signin")}
        >
          log in
        </Button>{" "}
        to continue.
      </p>

      <div className="space-y-3">
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guestEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guestPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
