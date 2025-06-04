import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

type Profile = Tables<"profiles">;

const payoutFormSchema = z.object({
  iban: z.string().min(15, "IBAN must be at least 15 characters").max(34, "IBAN must not exceed 34 characters"),
  account_holder_name: z.string().min(2, "Account holder name is required").max(100),
  bank_name: z.string().max(100).optional(),
  swift_code: z.string().max(11).optional(),
  nif: z.string().min(1, "NIF is required").max(20),
  is_company: z.boolean().default(false),
  company_name: z.string().optional(),
});

type PayoutFormValues = z.infer<typeof payoutFormSchema>;

interface PayoutFormProps {
  profile: Profile | null;
  onSave: (values: Partial<Profile>) => Promise<void>;
}

const maskIban = (iban: string | null) => {
  if (!iban) return "";
  if (iban.length <= 4) return iban;
  return "****" + iban.slice(-4);
};

const maskNif = (nif: string | null) => {
  if (!nif) return "";
  if (nif.length <= 3) return nif;
  return "****" + nif.slice(-3);
};

export function PayoutForm({ profile, onSave }: PayoutFormProps) {
  const [isCompany, setIsCompany] = useState(false);

  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutFormSchema),
    defaultValues: {
      iban: "",
      account_holder_name: profile?.account_holder_name || "",
      bank_name: profile?.bank_name || "",
      swift_code: profile?.swift_code || "",
      nif: "",
      is_company: false,
      company_name: profile?.company_name || "",
    },
  });

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      // Determine if it's a company registration based on existing company_name
      const isCompanyRegistration = Boolean(profile.company_name);
      setIsCompany(isCompanyRegistration);
      
      form.reset({
        iban: "",
        account_holder_name: profile.account_holder_name || "",
        bank_name: profile.bank_name || "",
        swift_code: profile.swift_code || "",
        nif: "",
        is_company: isCompanyRegistration,
        company_name: profile.company_name || "",
      });
    }
  }, [profile, form]);

  async function onSubmit(values: PayoutFormValues) {
    // Remove company_name if not a company registration
    const submissionValues = {
      ...values,
      company_name: values.is_company ? values.company_name : null,
    };
    await onSave(submissionValues);
  }

  const formatIban = (value: string) => {
    // Remove spaces and convert to uppercase
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    // Add spaces every 4 characters for display
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const hasPayoutDetails = profile?.iban && profile?.account_holder_name && profile?.nif;

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <InfoIcon className="h-5 w-5" />
            How payouts work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ul className="space-y-1 text-sm">
            <li>• Monthly payouts on the 1st of each month</li>
            <li>• Includes all bookings from the previous month</li>
            <li>• Allow 3-5 business days for bank processing</li>
            <li>• Minimum payout: €50</li>
          </ul>
        </CardContent>
      </Card>

      {/* Current Status */}
      {hasPayoutDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Current Payout Details</CardTitle>
            <CardDescription>
              Your payout information is securely stored. Only the last few digits are shown for security.
              {profile?.payout_details_updated_at && (
                <span className="block mt-1">
                  Last updated: {format(new Date(profile.payout_details_updated_at), "PPP")}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">IBAN:</span> {maskIban(profile?.iban)}
              </div>
              <div>
                <span className="font-medium">Account Holder:</span> {profile?.account_holder_name}
              </div>
              <div>
                <span className="font-medium">NIF:</span> {maskNif(profile?.nif)}
              </div>
              {profile?.bank_name && (
                <div>
                  <span className="font-medium">Bank:</span> {profile.bank_name}
                </div>
              )}
              {profile?.company_name && (
                <div>
                  <span className="font-medium">Company:</span> {profile.company_name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{hasPayoutDetails ? "Update" : "Add"} Payout Details</CardTitle>
          <CardDescription>
            {hasPayoutDetails 
              ? "Update your banking and tax information for receiving payouts." 
              : "Add your banking and tax information to receive payouts from your events."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Bank Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Bank Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="iban"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>IBAN *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ES91 2100 0418 4502 0005 1332"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatIban(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={39} // 34 chars + 5 spaces
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="account_holder_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name as on bank account" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Santander, BBVA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="swift_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SWIFT/BIC Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., BSCHESMMXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tax Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tax Information</h3>
                
                {/* Company Registration Toggle */}
                <FormField
                  control={form.control}
                  name="is_company"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsCompany(Boolean(checked));
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium">
                          I'm registering as a company/business
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Check this if you're operating as a business entity rather than an individual
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NIF Field with Dynamic Label */}
                  <FormField
                    control={form.control}
                    name="nif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isCompany ? "Company NIF (Business Tax ID)" : "NIF (Personal Tax ID)"} *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={isCompany ? "Company tax identification number" : "Your personal tax identification number"}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Company Name Field - Only shown when is_company is true */}
                  {isCompany && (
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your business/company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Payout Details"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
