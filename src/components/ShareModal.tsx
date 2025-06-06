import React from 'react';
import { Copy, Facebook, Twitter, Instagram, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  eventUrl
}) => {
  const { toast } = useToast();

  const shareText = `Check out this experience on Provaa: ${eventTitle}`;
  const hashtags = '#LocalExperiences #Provaa';
  const fullShareText = `${shareText} ${hashtags}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        // Fixed Facebook sharing URL 
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(fullShareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we copy the text and link
        handleCopyLink();
        toast({
          title: "Ready for Instagram!",
          description: "Link copied - paste it in your Instagram story or post",
          duration: 3000,
        });
        return;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${fullShareText} ${eventUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      // Open in new tab instead of same window navigation
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Share Experience
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Social Media Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center gap-2 h-12 hover:bg-blue-50 hover:border-blue-200"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center gap-2 h-12 hover:bg-sky-50 hover:border-sky-200"
            >
              <Twitter className="h-5 w-5 text-sky-500" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSocialShare('instagram')}
              className="flex items-center gap-2 h-12 hover:bg-pink-50 hover:border-pink-200"
            >
              <Instagram className="h-5 w-5 text-pink-600" />
              Instagram
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleSocialShare('whatsapp')}
              className="flex items-center gap-2 h-12 hover:bg-green-50 hover:border-green-200"
            >
              <MessageSquare className="h-5 w-5 text-green-600" />
              WhatsApp
            </Button>
          </div>
          
          {/* Copy Link Button */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full h-12"
          >
            <Copy className="h-5 w-5 mr-2" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
