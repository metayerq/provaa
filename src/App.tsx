import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";

import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from '@/pages/EditEventPage';
import HostEventsPage from "./pages/HostEventsPage";
import AttendeeManagementPage from "./pages/AttendeeManagementPage";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import SavedEvents from "./pages/SavedEvents";
import TestCalendar from "./pages/TestCalendar";
import TestFavorites from "./pages/TestFavorites";
import TestModernSearch from "./pages/TestModernSearch";
import FAQ from "./pages/FAQ";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminEmailNotifications from "./pages/admin/AdminEmailNotifications";
import AdminBanners from "@/pages/admin/AdminBanners";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/host/events" element={<ProtectedRoute><HostEventsPage /></ProtectedRoute>} />
              <Route path="/host/events/create" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
              <Route path="/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
              <Route path="/host/events/:id/edit" element={<ProtectedRoute><EditEventPage /></ProtectedRoute>} />
              <Route path="/host/events/:eventId/attendees" element={<ProtectedRoute><AttendeeManagementPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute><SavedEvents /></ProtectedRoute>} />
              <Route path="/test-calendar" element={<TestCalendar />} />
              <Route path="/test-favorites" element={<TestFavorites />} />
              <Route path="/test-modern-search" element={<TestModernSearch />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
