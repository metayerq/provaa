
import React from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-emerald-700 mb-4">Tastee</h1>
          <p className="text-xl text-gray-600">Food & Beverage Tasting Events Platform</p>
        </header>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Tastee</h2>
          <p className="text-gray-700 mb-6">
            Discover and create amazing tasting events for artisanal food and beverages.
            From wine and cheese to coffee, chocolate, and more.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-emerald-700 hover:bg-emerald-800">
              Explore Events
            </Button>
            <Button variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
              Create an Event
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Wine Tastings</h3>
            <p className="text-gray-700">Discover expert-led wine tastings near you.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Cheese Events</h3>
            <p className="text-gray-700">Explore artisanal cheese sampling events.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Coffee Experiences</h3>
            <p className="text-gray-700">Join coffee cupping sessions and tastings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
