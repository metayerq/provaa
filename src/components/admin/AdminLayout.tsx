
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  Wallet,
  Settings,
  Mail,
  ArrowLeft,
  Image
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/bookings', label: 'Bookings', icon: CreditCard },
    { path: '/admin/payouts', label: 'Payouts', icon: Wallet },
    { path: '/admin/banners', label: 'Banners', icon: Image },
    { path: '/admin/email-notifications', label: 'Email Notifications', icon: Mail },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Header */}
      <header className="bg-white border-b border-medium-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-sm text-text-secondary hover:text-text-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Provaa
              </Link>
              <div className="h-6 border-l border-medium-gray"></div>
              <h1 className="text-xl font-semibold text-text-primary">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-light text-mint'
                            : 'text-text-secondary hover:text-text-primary hover:bg-light-gray'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
