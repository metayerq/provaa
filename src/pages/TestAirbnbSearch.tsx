import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Users, Search } from 'lucide-react';
import AirbnbStyleSearch from '@/components/search/AirbnbStyleSearch';
import Layout from '@/components/layout/Layout';

const TestAirbnbSearch: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Airbnb-Style Search Component Test
          </h1>
          <p className="text-gray-600">
            Testing the new Airbnb-style search component with date and guest selection functionality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Component Demo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Airbnb-Style Search Component</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-8">
                <AirbnbStyleSearch />
              </div>
            </CardContent>
          </Card>

          {/* Features Showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Date Range Selection</p>
                    <p className="text-sm text-gray-600">Interactive calendar with check-in/check-out dates</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Guest Counter</p>
                    <p className="text-sm text-gray-600">Separate counters for adults, children, and infants</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Airbnb-Style Design</p>
                    <p className="text-sm text-gray-600">Clean, modern interface with rounded search bar</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Interactive Dropdowns</p>
                    <p className="text-sm text-gray-600">Click outside or ESC to close, smooth animations</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">URL Parameters</p>
                    <p className="text-sm text-gray-600">Generates proper query parameters for event filtering</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Sections */}
          <Card>
            <CardHeader>
              <CardTitle>Search Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-emerald-800">DATE Section</p>
                    <p className="text-sm text-emerald-600">Opens calendar dropdown for date range selection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">WHO Section</p>
                    <p className="text-sm text-blue-600">Opens guest counter for adults, children, infants</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Search className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Search Button</p>
                    <p className="text-sm text-gray-600">Navigates to events page with filters applied</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Positioning</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Removed from navbar completely</li>
                    <li>• Positioned in hero section</li>
                    <li>• Between subtitle and CTA buttons</li>
                    <li>• Centered with max-width: 800px</li>
                    <li>• 40px margins top and bottom</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Styling</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• White background with shadow</li>
                    <li>• Rounded-full design (border-radius: 50px)</li>
                    <li>• Hover effects on sections</li>
                    <li>• Emerald brand colors for buttons</li>
                    <li>• Smooth transitions and animations</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Functionality</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Date range selection logic</li>
                    <li>• Guest counter with increment/decrement</li>
                    <li>• Click outside to close dropdowns</li>
                    <li>• ESC key to close dropdowns</li>
                    <li>• URL parameter generation</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Integration</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Replaces navbar search completely</li>
                    <li>• Navigates to /events with filters</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Preserves existing functionality</li>
                    <li>• Brand-consistent styling</li>
                  </ul>
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
                <li>Click on the "DATE" section to open the calendar dropdown</li>
                <li>Select a check-in date by clicking on a calendar date</li>
                <li>Select a check-out date (must be after check-in date)</li>
                <li>Click on the "WHO" section to open the guest counter</li>
                <li>Use + and - buttons to adjust guest counts</li>
                <li>Click the search button to navigate with filters</li>
                <li>Test closing dropdowns by clicking outside or pressing ESC</li>
                <li>Verify the component works on mobile devices</li>
                <li>Check that it's properly positioned in the home hero section</li>
              </ol>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">Expected Behavior</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Clean Airbnb-style design with white background</li>
                  <li>• Smooth hover effects and animations</li>
                  <li>• Proper date range selection logic</li>
                  <li>• Guest counter with proper validation</li>
                  <li>• Navigation to events page with filters applied</li>
                  <li>• Responsive design that works on all screen sizes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TestAirbnbSearch; 