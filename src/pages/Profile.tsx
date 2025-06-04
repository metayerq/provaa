import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";

type Profile = Tables<"profiles">;

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message || "An error occurred while loading your profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, toast]);

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      setProfile((prevProfile) => {
        if (!prevProfile) return null;
        return { ...prevProfile, ...updatedProfile };
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    }
  };

  const getUserTypeBadgeColor = (userType: string | null) => {
    switch (userType) {
      case "attendee":
        return "bg-blue-500";
      case "host":
        return "bg-emerald-500";
      case "both":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUserTypeLabel = (userType: string | null) => {
    switch (userType) {
      case "attendee":
        return "Attendee";
      case "host":
        return "Host";
      case "both":
        return "Host & Attendee";
      default:
        return "User";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown";
    try {
      return format(new Date(dateString), "MMMM yyyy");
    } catch {
      return "Unknown";
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container max-w-4xl py-8 px-4 mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
            </div>
          ) : (
            <>
              {/* Profile Header Card */}
              <Card className="mb-8">
                <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-6">
                  <div className="flex-shrink-0">
                    <AvatarUpload
                      user={user!}
                      url={profile?.avatar_url}
                      onUploadComplete={(url) => {
                        setProfile((prev) => prev ? { ...prev, avatar_url: url } : null);
                      }}
                      size={150}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold">
                      {profile?.full_name || user?.email?.split("@")[0] || "User"}
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 text-muted-foreground">
                      <span className="text-sm">
                        Member since {formatDate(user?.created_at)}
                      </span>
                      
                      <Badge className={`${getUserTypeBadgeColor(profile?.user_type)}`}>
                        {getUserTypeLabel(profile?.user_type)}
                      </Badge>
                    </div>
                    
                    <p className="mt-4 text-sm text-muted-foreground">
                      Email: {user?.email}
                    </p>
                    
                    {profile?.location && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Location: {profile.location}
                      </p>
                    )}
                    
                    {profile?.host_story && (
                      <div className="mt-4 bg-muted p-3 rounded-md">
                        <p className="text-sm">{profile.host_story}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Profile Forms */}
              <Card>
                <CardContent className="pt-6">
                  <ProfileTabs 
                    profile={profile} 
                    onProfileUpdate={handleProfileUpdate} 
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
