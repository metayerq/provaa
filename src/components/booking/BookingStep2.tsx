
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Check } from 'lucide-react';

export const BookingStep2: React.FC = () => {
  const { user } = useAuth();
  const { bookingData, updateBookingData, setCurrentStep } = useBooking();
  const [useAccountDetails, setUseAccountDetails] = useState(true);
  const [guestInfo, setGuestInfo] = useState({
    name: bookingData.guestInfo?.name || '',
    email: bookingData.guestInfo?.email || '',
    phone: bookingData.guestInfo?.phone || '',
    createAccount: bookingData.guestInfo?.createAccount || false
  });

  const handleContinue = () => {
    if (user && useAccountDetails) {
      updateBookingData({
        guestInfo: {
          name: user.user_metadata?.full_name || user.email || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          createAccount: false
        }
      });
    } else {
      updateBookingData({ guestInfo });
    }
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const isValid = () => {
    if (user && useAccountDetails) return true;
    return guestInfo.name && guestInfo.email && guestInfo.phone;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Guest Information</h2>
        <div className="h-0.5 bg-gray-200 mb-6"></div>
      </div>

      {user ? (
        <div className="space-y-4">
          {useAccountDetails ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Check className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-emerald-800 mb-2">Using your account details:</p>
                  <div className="text-sm text-emerald-700 space-y-1">
                    <p>{user.user_metadata?.full_name || user.email}</p>
                    <p>{user.email}</p>
                    {user.user_metadata?.phone && <p>{user.user_metadata.phone}</p>}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => setUseAccountDetails(false)}
              >
                Use different details
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                variant="outline"
                onClick={() => setUseAccountDetails(true)}
                className="mb-4"
              >
                ← Use account details instead
              </Button>
              
              <div>
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="guestName">Full name *</Label>
            <Input
              id="guestName"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="guestEmail">Email *</Label>
            <Input
              id="guestEmail"
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="guestPhone">Phone *</Label>
            <Input
              id="guestPhone"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="createAccount"
              checked={guestInfo.createAccount}
              onCheckedChange={(checked) => 
                setGuestInfo(prev => ({ ...prev, createAccount: checked as boolean }))
              }
            />
            <Label htmlFor="createAccount" className="text-sm">
              Create account for faster future bookings
            </Label>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isValid()}
          className="flex-1 bg-emerald-700 hover:bg-emerald-800"
        >
          Continue to Payment →
        </Button>
      </div>
    </div>
  );
};
