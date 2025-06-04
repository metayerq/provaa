
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { HostEventsContent } from '@/components/host/HostEventsContent';

const HostEventsPage = () => {
  return (
    <ProtectedRoute requiredUserType="host">
      <Layout>
        <HostEventsContent />
      </Layout>
    </ProtectedRoute>
  );
};

export default HostEventsPage;
