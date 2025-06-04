
import { z } from 'zod';

export const bookingFormSchema = z.object({
  numberOfTickets: z.number().min(1).max(10),
  guestName: z.string().min(1, "Name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().min(1, "Phone is required"),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional()
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const getDefaultFormValues = (): BookingFormData => ({
  numberOfTickets: 1,
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  dietaryRestrictions: '',
  specialRequests: ''
});
