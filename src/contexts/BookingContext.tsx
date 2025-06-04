
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BookingData {
  eventId: string;
  eventTitle: string;
  hostName: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  price: number;
  serviceFee: number;
  totalAmount: number;
  numberOfTickets: number;
  spotsLeft: number;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
    createAccount: boolean;
  };
  dietaryRestrictions?: string;
  specialRequests?: string;
  paymentMethod?: string;
  bookingReference?: string;
}

interface BookingContextType {
  currentStep: number;
  bookingData: BookingData;
  setCurrentStep: (step: number) => void;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
  initialData: Partial<BookingData>;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ 
  children, 
  initialData 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    eventId: '',
    eventTitle: '',
    hostName: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    price: 0,
    serviceFee: 0,
    totalAmount: 0,
    numberOfTickets: 1,
    spotsLeft: 0,
    ...initialData
  });

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({
      eventId: '',
      eventTitle: '',
      hostName: '',
      date: '',
      time: '',
      duration: '',
      location: '',
      price: 0,
      serviceFee: 0,
      totalAmount: 0,
      numberOfTickets: 1,
      spotsLeft: 0,
      ...initialData
    });
  };

  return (
    <BookingContext.Provider value={{
      currentStep,
      bookingData,
      setCurrentStep,
      updateBookingData,
      resetBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};
