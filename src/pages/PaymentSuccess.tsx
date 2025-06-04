import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { PaymentVerificationLoader } from '@/components/payment/PaymentVerificationLoader';
import { PaymentErrorState } from '@/components/payment/PaymentErrorState';
import { PaymentSuccessState } from '@/components/payment/PaymentSuccessState';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const {
    booking,
    isVerifying,
    verificationError,
    authRestored,
    bookingRef
  } = usePaymentVerification();

  const handleNavigateHome = () => navigate('/');
  const handleContactSupport = () => navigate('/contact');
  const handleViewBookings = () => navigate('/bookings');

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {isVerifying && (
          <PaymentVerificationLoader
            authRestored={authRestored}
            onCancel={handleNavigateHome}
          />
        )}

        {verificationError && !isVerifying && (
          <PaymentErrorState
            bookingRef={bookingRef}
            onNavigateHome={handleNavigateHome}
            onContactSupport={handleContactSupport}
          />
        )}

        {!verificationError && !isVerifying && (
          <PaymentSuccessState
            booking={booking}
            authRestored={authRestored}
            onNavigateHome={handleNavigateHome}
            onViewBookings={handleViewBookings}
          />
        )}
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
