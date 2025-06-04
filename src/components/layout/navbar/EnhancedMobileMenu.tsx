import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Heart, 
  User, 
  Settings, 
  LogOut,
  Plus,
  ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedMobileMenuProps {
  isMenuOpen: boolean;
  onClose: () => void;
}

const EnhancedMobileMenu = ({ isMenuOpen, onClose }: EnhancedMobileMenuProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, user_type, role')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const navigationItems = [
    { 
      label: "Experiences", 
      href: "/events", 
      icon: Calendar,
      description: "Browse all events"
    },
    { 
      label: "Saved Events", 
      href: "/saved", 
      icon: Heart,
      description: "Your favorites"
    },
  ];

  const userItems = user ? [
    { 
      label: "My Bookings", 
      href: "/bookings", 
      icon: Calendar,
      description: "View your reservations"
    },
    { 
      label: "Profile", 
      href: "/profile", 
      icon: User,
      description: "Account settings"
    },
  ] : [];

  // Add Manage Experiences for host users
  if (user && (profile?.user_type === 'host' || profile?.user_type === 'both')) {
    userItems.push({
      label: "Manage Experiences",
      href: "/host/events",
      icon: Settings,
      description: "Host dashboard"
    });
  }

  const getLocationDisplayName = () => {
    if (location.pathname === '/') return 'Home';
    if (location.pathname === '/saved') return 'Saved Events';
    if (location.pathname === '/events') return 'Experiences';
    if (location.pathname === '/bookings') return 'My Bookings';
    if (location.pathname === '/profile') return 'Profile';
    if (location.pathname === '/host/events') return 'Manage Experiences';
    return location.pathname.replace('/', '').replace('-', ' ');
  };

  const handleNavigation = (href: string) => {
    window.location.href = href;
    onClose();
  };

  if (!isMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed inset-x-0 top-16 bottom-0 bg-white z-50 animate-slide-in-from-top">
        <div className="flex flex-col h-full">
          {/* Current Page Indicator */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="text-sm text-gray-500">Currently viewing</div>
            <div className="font-medium text-gray-900 capitalize">
              {getLocationDisplayName()}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Navigation
              </h3>
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-50 border-2 border-emerald-200' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        isActive ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <item.icon className={`h-5 w-5 ${
                          isActive ? 'text-emerald-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium ${
                          isActive ? 'text-emerald-900' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-sm ${
                          isActive ? 'text-emerald-600' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* User Section */}
            {user && (
              <div className="p-4 space-y-2 border-t">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Account
                </h3>
                {userItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-emerald-50 border-2 border-emerald-200' 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}>
                          <item.icon className={`h-5 w-5 ${
                            isActive ? 'text-emerald-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="text-left">
                          <div className={`font-medium ${
                            isActive ? 'text-emerald-900' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-sm ${
                            isActive ? 'text-emerald-600' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Host Section */}
            {!user && (
              <div className="p-4 space-y-2 border-t">
                <button
                  onClick={() => handleNavigation('/create-event')}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border-2 border-transparent transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Plus className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">I'm a Host</div>
                      <div className="text-sm text-gray-500">Create experiences</div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t bg-gray-50">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">Signed in</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  className="w-full h-12"
                  onClick={() => handleNavigation('/auth/signin')}
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => handleNavigation('/auth/signup')}
                >
                  Create Account
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedMobileMenu;
