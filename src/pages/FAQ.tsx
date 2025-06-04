
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQSidebar } from '@/components/faq/FAQSidebar';
import { FAQContent } from '@/components/faq/FAQContent';
import { faqData } from '@/data/faqData';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'getting-started', name: 'Getting Started', count: faqData.filter(q => q.category === 'getting-started').length },
    { id: 'attendees', name: 'For Attendees', count: faqData.filter(q => q.category === 'attendees').length },
    { id: 'hosts', name: 'For Hosts', count: faqData.filter(q => q.category === 'hosts').length },
    { id: 'events', name: 'Events & Experiences', count: faqData.filter(q => q.category === 'events').length },
    { id: 'payments', name: 'Payments & Refunds', count: faqData.filter(q => q.category === 'payments').length },
    { id: 'account', name: 'Account & Profile', count: faqData.filter(q => q.category === 'account').length },
    { id: 'support', name: 'Technical Support', count: faqData.filter(q => q.category === 'support').length },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <HelpCircle className="h-8 w-8 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about Provaa events, bookings, and hosting experiences.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <FAQSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* FAQ Content */}
            <div className="lg:w-3/4">
              <FAQContent
                faqs={filteredFAQs}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-emerald-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still need help?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you get the most out of your Provaa experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                  Browse Help Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
