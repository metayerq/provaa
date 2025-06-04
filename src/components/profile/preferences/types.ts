
import { z } from "zod";

export const preferencesFormSchema = z.object({
  emailNotifications: z.object({
    reminders: z.boolean().default(true),
    newEvents: z.boolean().default(true),
    marketing: z.boolean().default(false),
  }),
  favoriteCategories: z.array(z.string()).default([]),
  dietaryRestrictions: z.array(z.string()).default([]),
});

export type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export interface EmailNotifications {
  reminders?: boolean;
  new_events?: boolean;
  marketing?: boolean;
}
