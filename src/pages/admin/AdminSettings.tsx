
import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const settingsSchema = z.object({
  commission_percentage: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Commission must be a number between 0 and 100"
  }),
  minimum_payout_amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Minimum payout must be a positive number"
  }),
  support_email: z.string().email("Please enter a valid email address"),
  site_title: z.string().min(1, "Site title is required"),
  site_description: z.string().min(1, "Site description is required").max(160, "Meta description should be under 160 characters"),
  og_image_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter_handle: z.string().regex(/^@[a-zA-Z0-9_]+$/, "Twitter handle must start with @ and contain only letters, numbers, and underscores").optional().or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const AdminSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('*');
      
      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      
      return settingsMap;
    },
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      commission_percentage: "10",
      minimum_payout_amount: "50",
      support_email: "support@provaa.com",
      site_title: "Provaa - Meet the Makers, Taste the Passion",
      site_description: "From natural wine cellars to secret supper clubs. Provaa connects food lovers with unique tastings, workshops, and dining experiences hosted by local experts.",
      og_image_url: "https://lovable.dev/opengraph-image-p98pqg.png",
      twitter_handle: "@provaa",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        commission_percentage: settings.commission_percentage || "10",
        minimum_payout_amount: settings.minimum_payout_amount || "50",
        support_email: settings.support_email || "support@provaa.com",
        site_title: settings.site_title || "Provaa - Meet the Makers, Taste the Passion",
        site_description: settings.site_description || "From natural wine cellars to secret supper clubs. Provaa connects food lovers with unique tastings, workshops, and dining experiences hosted by local experts.",
        og_image_url: settings.og_image_url || "https://lovable.dev/opengraph-image-p98pqg.png",
        twitter_handle: settings.twitter_handle || "@provaa",
      });
    }
  }, [settings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const updates = Object.entries(values).map(([key, value]) => ({
        key,
        value: value.toString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert({ 
            key: update.key, 
            value: update.value 
          }, { 
            onConflict: 'key' 
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Platform settings have been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    updateSettingsMutation.mutate(values);
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600">Configure platform-wide settings</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="commission_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Commission (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimum_payout_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Payout Amount (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="support_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="support@provaa.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <p className="text-sm text-gray-600">
                Manage meta tags and social media previews for your site
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="site_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Provaa - Meet the Makers, Taste the Passion"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      This appears in browser tabs and search results
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="From natural wine cellars to secret supper clubs..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      {field.value?.length || 0}/160 characters - This appears in search results and social media previews
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="og_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Graph Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        type="url"
                        placeholder="https://example.com/og-image.png"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Image that appears when your site is shared on social media (recommended: 1200x630px)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter_handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Handle</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="@provaa"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Your Twitter handle for Twitter Card attribution
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            disabled={updateSettingsMutation.isPending || !form.formState.isDirty}
            className="w-full sm:w-auto"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSettings;
