
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

export const EventNotFound: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Experience Not Found</h2>
          <p className="mt-4 text-gray-600">The experience you're looking for doesn't exist or has been removed.</p>
          <Link to="/events">
            <Button className="mt-6 bg-emerald-700 hover:bg-emerald-800">
              Browse All Experiences
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};
