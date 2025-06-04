
import { z } from "zod";

export const bookingSchema = z.object({
  numberOfTickets: z.coerce.number().int().min(1, "At least 1 ticket is required"),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional(),
  // Guest fields for non-authenticated users
  guestName: z.string().optional(),
  guestEmail: z.string().email("Invalid email address").optional(),
  guestPhone: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const createBookingValidationSchema = (user: any) => {
  return user 
    ? bookingSchema 
    : bookingSchema.refine(
        data => !!data.guestName, 
        { message: "Name is required", path: ["guestName"] }
      ).refine(
        data => !!data.guestEmail,
        { message: "Email is required", path: ["guestEmail"] }
      );
};
