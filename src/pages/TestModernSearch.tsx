import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target, User, MapPin, Search } from 'lucide-react';
import ModernSearchBar from '@/components/search/ModernSearchBar';
import Layout from '@/components/layout/Layout';

const TestModernSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [navbarSearchQuery, setNavbarSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
  };

  const handleNavbarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Navbar search submitted:', navbarSearchQuery);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Modern Search Design Test
          </h1>
          <p className="text-gray-600">
            Testing the new modern, fluid search bar design with glassmorphism and enhanced UX.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Bar Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Search Bar Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Standalone Search</h3>
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                  <ModernSearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    variant="standalone"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Navbar Style (Glassmorphism)</h3>
                <div className="p-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-xl">
                  <ModernSearchBar
                    searchQuery={navbarSearchQuery}
                    setSearchQuery={setNavbarSearchQuery}
                    handleSearch={handleNavbarSearch}
                    variant="navbar"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>New Features & Improvements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Glassmorphism Design</p>
                    <p className="text-sm text-gray-600">Backdrop-filter blur with semi-transparent backgrounds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Smooth Animations</p>
                    <p className="text-sm text-gray-600">Hover effects, focus states, and dropdown transitions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Enhanced Placeholder</p>
                    <p className="text-sm text-gray-600">"Search experiences, hosts, locations..." for clarity</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Redesigned Dropdown</p>
                    <p className="text-sm text-gray-600">Removed "Search Results" header, added section grouping</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Better Result Items</p>
                    <p className="text-sm text-gray-600">Category icons, type badges, and hover animations</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Keyboard Navigation</p>
                    <p className="text-sm text-gray-600">Arrow keys, Enter, and Escape key support</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Result Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Search Result Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-800">Experiences 🎯</p>
                    <p className="text-sm text-emerald-600">Event titles with dates and locations</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Hosts 👤</p>
                    <p className="text-sm text-blue-600">Host profiles with experience counts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-800">Locations 📍</p>
                    <p className="text-sm text-purple-600">Cities and venues with experience counts</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">CSS Properties</h4>
                <div className="text-sm text-gray-700 space-y-1 font-mono">
                  <p>backdrop-filter: blur(10px)</p>
                  <p>background: rgba(255, 255, 255, 0.1)</p>
                  <p>border-radius: 50px</p>
                  <p>transition: all 0.3s ease</p>
                  <p>transform: translateY(-2px) on focus</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Animations</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• Hover scale (110%)</p>
                  <p>• Focus lift (-2px translateY)</p>
                  <p>• Dropdown fade + slide (0.3s)</p>
                  <p>• Result item slide on hover</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testing Instructions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Type at least 2 characters in the search input to see suggestions appear</li>
                <li>Notice the smooth glassmorphism effect on the navbar variant</li>
                <li>Observe the categorized dropdown sections with proper icons and styling</li>
                <li>Test keyboard navigation with arrow keys, Enter, and Escape</li>
                <li>Check hover effects on search result items</li>
                <li>Verify that search term highlighting works correctly</li>
                <li>Test clicking outside the dropdown to close it</li>
                <li>Navigate to different pages via search results</li>
                <li>Check mobile responsiveness and touch interactions</li>
              </ol>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">Expected Behavior</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Search input has improved placeholder text</li>
                  <li>• No "Search Results" header in dropdown</li>
                  <li>• Clear section grouping with icons and category names</li>
                  <li>• Smooth animations and hover effects throughout</li>
                  <li>• Enhanced visual hierarchy and typography</li>
                  <li>• Better spacing and card-like result items</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Integration Points</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Main navbar search bar</li>
                  <li>• Mobile search overlay</li>
                  <li>• Events page search functionality</li>
                  <li>• All existing search logic and API calls preserved</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TestModernSearch; 