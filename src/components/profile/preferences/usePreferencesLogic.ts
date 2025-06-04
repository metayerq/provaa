
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { PreferencesFormValues } from "./types";

type Profile = Tables<"profiles">;

interface UsePreferencesLogicProps {
  onSave: (values: Partial<Profile>) => Promise<void>;
}

export function usePreferencesLogic({ onSave }: UsePreferencesLogicProps) {
  const { toast } = useToast();
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const autoSave = async (values: PreferencesFormValues) => {
    setIsAutoSaving(true);
    try {
      await onSave({
        email_notifications: {
          reminders: values.emailNotifications.reminders,
          new_events: values.emailNotifications.newEvents,
          marketing: values.emailNotifications.marketing,
        },
        favorite_categories: values.favoriteCategories,
        dietary_restrictions: values.dietaryRestrictions.join(', '),
      });
      
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated automatically",
      });
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAutoSaving(false);
    }
  };

  return {
    isAutoSaving,
    autoSave,
  };
}
