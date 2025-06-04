
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoForm } from "./ProfileInfoForm";
import { PreferencesForm } from "./PreferencesForm";
import { AccountForm } from "./AccountForm";
import { PayoutForm } from "./PayoutForm";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface ProfileTabsProps {
  profile: Profile | null;
  onProfileUpdate: (profile: Partial<Profile>) => Promise<void>;
}

export function ProfileTabs({ profile, onProfileUpdate }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Check if user is a host or both
  const isHost = profile?.user_type === "host" || profile?.user_type === "both";
  
  return (
    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 mb-8 scrollbar-hide">
        <TabsTrigger 
          value="profile" 
          className="flex-shrink-0 min-w-fit px-3 py-2 text-sm whitespace-nowrap"
        >
          Profile Info
        </TabsTrigger>
        <TabsTrigger 
          value="preferences" 
          className="flex-shrink-0 min-w-fit px-3 py-2 text-sm whitespace-nowrap"
        >
          Preferences
        </TabsTrigger>
        {isHost && (
          <TabsTrigger 
            value="payout" 
            className="flex-shrink-0 min-w-fit px-3 py-2 text-sm whitespace-nowrap"
          >
            Payout Details
          </TabsTrigger>
        )}
        <TabsTrigger 
          value="account" 
          className="flex-shrink-0 min-w-fit px-3 py-2 text-sm whitespace-nowrap"
        >
          Account
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileInfoForm profile={profile} onSave={onProfileUpdate} />
      </TabsContent>
      
      <TabsContent value="preferences">
        <PreferencesForm profile={profile} onSave={onProfileUpdate} />
      </TabsContent>
      
      {isHost && (
        <TabsContent value="payout">
          <PayoutForm profile={profile} onSave={onProfileUpdate} />
        </TabsContent>
      )}
      
      <TabsContent value="account">
        <AccountForm />
      </TabsContent>
    </Tabs>
  );
}
