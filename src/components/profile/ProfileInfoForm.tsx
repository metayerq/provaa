
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50),
  user_type: z.enum(["attendee", "host", "both"], {
    required_error: "Please select how you want to use Tastee",
  }),
  location: z.string().optional(),
  host_story: z.string().max(500, {
    message: "Host story must not be longer than 500 characters.",
  }).optional(),
  credentials: z.string().max(200, {
    message: "Credentials must not be longer than 200 characters.",
  }).optional(),
  languages_spoken: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileInfoFormProps {
  profile: Profile | null;
  onSave: (values: Partial<Profile>) => Promise<void>;
}

export function ProfileInfoForm({ profile, onSave }: ProfileInfoFormProps) {
  const languageOptions = [
    'English', 'French', 'Spanish', 'Italian', 'German', 'Portuguese', 'Dutch', 'Chinese', 'Japanese'
  ];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      user_type: (profile?.user_type as "attendee" | "host" | "both") || "attendee",
      location: profile?.location || "",
      host_story: profile?.host_story || "",
      credentials: profile?.credentials || "",
      languages_spoken: profile?.languages_spoken || [],
    },
  });
  
  const watchedUserType = form.watch("user_type");
  const isHost = watchedUserType === "host" || watchedUserType === "both";
  
  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        user_type: (profile.user_type as "attendee" | "host" | "both") || "attendee",
        location: profile.location || "",
        host_story: profile.host_story || "",
        credentials: profile.credentials || "",
        languages_spoken: profile.languages_spoken || [],
      });
    }
  }, [profile, form]);

  async function onSubmit(values: ProfileFormValues) {
    await onSave(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="user_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I want to use Tastee as:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="attendee" id="attendee" />
                    <label htmlFor="attendee" className="cursor-pointer flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      🎟️ Event Attendee - I want to discover events
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="host" id="host" />
                    <label htmlFor="host" className="cursor-pointer flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      🏠 Event Host - I want to create events
                    </label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-3">
                    <RadioGroupItem value="both" id="both" />
                    <label htmlFor="both" className="cursor-pointer flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      🌟 Both - I want to do both
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Your city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languages_spoken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages Spoken</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {languageOptions.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={field.value?.includes(language) || false}
                      onCheckedChange={(checked) => {
                        const updatedLanguages = checked
                          ? [...(field.value || []), language]
                          : (field.value || []).filter((lang) => lang !== language);
                        field.onChange(updatedLanguages);
                      }}
                    />
                    <label 
                      htmlFor={`language-${language}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {language}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Host-specific fields */}
        {isHost && (
          <>
            <FormField
              control={form.control}
              name="credentials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Credentials</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Certified Sommelier, Chef, Wine Educator" 
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <div className="text-xs text-right text-muted-foreground">
                    {field.value?.length || 0}/200 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="host_story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Host Story</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your passion, experience, and what makes your events special. This will be displayed on your event pages." 
                      className="resize-none min-h-[120px]"
                      {...field}
                      maxLength={500}
                    />
                  </FormControl>
                  <div className="text-xs text-right text-muted-foreground">
                    {field.value?.length || 0}/500 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
