
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tables } from "@/integrations/supabase/types";
import { EmailNotificationsSection } from "./preferences/EmailNotificationsSection";
import { FavoriteCategoriesSection } from "./preferences/FavoriteCategoriesSection";
import { DietaryRestrictionsSection } from "./preferences/DietaryRestrictionsSection";
import { usePreferencesLogic } from "./preferences/usePreferencesLogic";
import { preferencesFormSchema, PreferencesFormValues, EmailNotifications } from "./preferences/types";

type Profile = Tables<"profiles">;

interface PreferencesFormProps {
  profile: Profile | null;
  onSave: (values: Partial<Profile>) => Promise<void>;
}

export function PreferencesForm({ profile, onSave }: PreferencesFormProps) {
  const { isAutoSaving, autoSave } = usePreferencesLogic({ onSave });

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      emailNotifications: {
        reminders: true,
        newEvents: true,
        marketing: false,
      },
      favoriteCategories: [],
      dietaryRestrictions: [],
    },
  });

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      // Safely parse email_notifications as EmailNotifications
      let emailNotifications: EmailNotifications = {
        reminders: true,
        new_events: true,
        marketing: false,
      };

      if (profile.email_notifications) {
        if (typeof profile.email_notifications === 'object' && profile.email_notifications !== null) {
          emailNotifications = profile.email_notifications as EmailNotifications;
        }
      }
      
      form.reset({
        emailNotifications: {
          reminders: emailNotifications.reminders ?? true,
          newEvents: emailNotifications.new_events ?? true,
          marketing: emailNotifications.marketing ?? false,
        },
        favoriteCategories: profile.favorite_categories || [],
        dietaryRestrictions: typeof profile.dietary_restrictions === 'string' 
          ? profile.dietary_restrictions.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      });
    }
  }, [profile, form]);

  const toggleCategory = (categoryId: string) => {
    const currentCategories = form.getValues('favoriteCategories');
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId];
    
    form.setValue('favoriteCategories', newCategories);
    autoSave({
      ...form.getValues(),
      favoriteCategories: newCategories,
    });
  };

  const toggleDietaryRestriction = (restrictionId: string) => {
    const currentRestrictions = form.getValues('dietaryRestrictions');
    const newRestrictions = currentRestrictions.includes(restrictionId)
      ? currentRestrictions.filter(id => id !== restrictionId)
      : [...currentRestrictions, restrictionId];
    
    form.setValue('dietaryRestrictions', newRestrictions);
    autoSave({
      ...form.getValues(),
      dietaryRestrictions: newRestrictions,
    });
  };

  const handleEmailNotificationChange = (field: keyof PreferencesFormValues['emailNotifications'], value: boolean) => {
    const currentNotifications = form.getValues('emailNotifications');
    const newNotifications = { ...currentNotifications, [field]: value };
    
    form.setValue('emailNotifications', newNotifications);
    autoSave({
      ...form.getValues(),
      emailNotifications: newNotifications,
    });
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        {/* Auto-save indicator */}
        {isAutoSaving && (
          <div className="text-sm text-muted-foreground italic">
            Saving preferences...
          </div>
        )}

        <EmailNotificationsSection onEmailNotificationChange={handleEmailNotificationChange} />
        <FavoriteCategoriesSection onToggleCategory={toggleCategory} />
        <DietaryRestrictionsSection onToggleDietaryRestriction={toggleDietaryRestriction} />
      </div>
    </Form>
  );
}
