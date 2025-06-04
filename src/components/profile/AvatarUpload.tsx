
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  user: User;
  url?: string | null;
  onUploadComplete: (url: string) => void;
  size?: number;
}

export function AvatarUpload({ user, url, onUploadComplete, size = 150 }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024; // size in MB
      const fileType = file.type;

      // Validate file
      if (fileSize > 5) {
        throw new Error("File size must be less than 5MB");
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(fileType)) {
        throw new Error("File must be a JPG, PNG, or WebP image");
      }

      // Show preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload to Supabase
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      onUploadComplete(data.publicUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message || "An error occurred while uploading your avatar",
        variant: "destructive",
      });
      // Reset preview if upload failed
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const avatarUrl = preview || url;
  const initials = user.email?.substring(0, 2).toUpperCase() || "TA";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Avatar display */}
      <div
        className="w-full h-full rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center border-2 border-emerald-200"
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-emerald-600">{initials}</span>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload overlay */}
      <label
        className="absolute inset-0 rounded-full cursor-pointer group flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 rounded-full transition-opacity"></div>
        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center">
          <Upload className="h-6 w-6 mb-1" />
          <span className="text-xs">Change Photo</span>
        </span>
        <input
          type="file"
          className="sr-only"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
