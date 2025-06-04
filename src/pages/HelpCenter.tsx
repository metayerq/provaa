
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User, Wine, CreditCard, ChefHat, Mail, Gift, ArrowRight, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/faq?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const helpCategories = [
    {
      icon: User,
      title: 'Account & Profile',
      description: 'Everything related to user accounts, settings, and personal information',
      link: '/faq?category=account',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Wine,
      title: 'Events & Experiences',
      description: 'Questions about culinary events, wine tastings, and cooking experiences',
      link: '/faq?category=events',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: CreditCard,
      title: 'Orders and Payments',
      description: 'Find answers about bookings, checkout, payments, and refunds',
      link: '/faq?category=payments',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: ChefHat,
      title: 'For Hosts',
      description: 'Host-specific guidance, event creation, and management resources',
      link: '/faq?category=hosts',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Mail,
      title: 'Contact & Support',
      description: 'Get in touch with our support team for personalized assistance',
      link: '/contact',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: Gift,
      title: 'Rewards & Referrals',
      description: 'Information about loyalty programs, referrals, and special offers',
      link: '/faq?category=getting-started',
      color: 'bg-yellow-50 text-yellow-600'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-mint-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-800">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Hello there 👋
              </h1>
              <h2 className="text-xl sm:text-2xl text-emerald-100 mb-8">
                How can we help you today?
              </h2>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg bg-white border-0 shadow-lg focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </form>

              {/* Quick Access Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  asChild
                  className="bg-white text-emerald-700 hover:bg-gray-50 px-6 py-3"
                >
                  <Link to="/faq?category=hosts">
                    <ChefHat className="h-5 w-5 mr-2" />
                    I am a host
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-emerald-700 px-6 py-3"
                >
                  <Link to="/faq?category=attendees">
                    <Users className="h-5 w-5 mr-2" />
                    I am an attendee
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by category
            </h3>
            <p className="text-xl text-gray-600">
              Find the information you need, organized by topic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <Link to={category.link}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                          {category.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center text-emerald-600 text-sm font-medium group-hover:text-emerald-700">
                          Learn more
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Questions Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Popular questions
              </h3>
              <p className="text-xl text-gray-600">
                Quick answers to the most common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link to="/faq" className="block">
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-emerald-700">
                      How do I book a culinary experience?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Learn about our booking process, payment options, and what to expect.
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link to="/faq" className="block">
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-emerald-700">
                      How do I become a host on Provaa?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Everything you need to know about hosting culinary experiences.
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link to="/faq" className="block">
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-emerald-700">
                      What if I have dietary restrictions?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Find out how hosts accommodate special dietary needs and preferences.
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Link to="/faq" className="block">
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-emerald-700">
                      How do cancellations and refunds work?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Understand our cancellation policies and refund process.
                    </p>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                <Link to="/faq">
                  View all questions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Still need help?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                <Link to="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                <Link to="/faq">
                  Browse FAQ
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
