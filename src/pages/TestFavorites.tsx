import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, CheckCircle } from 'lucide-react';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import Layout from '@/components/layout/Layout';

const TestFavorites: React.FC = () => {
  // Sample event ID for testing
  const sampleEventId = 'test-event-1';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Favorites Test Page
          </h1>
          <p className="text-gray-600">
            Test the new favorite button functionality and experience card implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Favorite Button Test */}
          <Card>
            <CardHeader>
              <CardTitle>Favorite Button Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Different Sizes</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <FavoriteButton eventId={sampleEventId} size="sm" />
                    <p className="text-xs mt-1">Small</p>
                  </div>
                  <div className="text-center">
                    <FavoriteButton eventId={sampleEventId} size="md" />
                    <p className="text-xs mt-1">Medium</p>
                  </div>
                  <div className="text-center">
                    <FavoriteButton eventId={sampleEventId} size="lg" />
                    <p className="text-xs mt-1">Large</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Background Options</h3>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg">
                  <div className="text-center">
                    <FavoriteButton eventId={sampleEventId} showBackground={true} />
                    <p className="text-xs mt-1 text-white">With Background</p>
                  </div>
                  <div className="text-center">
                    <FavoriteButton eventId={sampleEventId} showBackground={false} />
                    <p className="text-xs mt-1 text-white">No Background</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Heart Button Positioning</p>
                    <p className="text-sm text-gray-600">Positioned in top-right corner, opposite to category tag</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Interactive States</p>
                    <p className="text-sm text-gray-600">Outlined when not saved, filled red when favorited</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">User Authentication</p>
                    <p className="text-sm text-gray-600">Shows registration modal for non-authenticated users</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Visual Feedback</p>
                    <p className="text-sm text-gray-600">Hover effects, scale animations, and smooth transitions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Database Integration</p>
                    <p className="text-sm text-gray-600">Uses existing useFavorites hook with Supabase backend</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testing Instructions */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Visit the <strong>Discover Experiences</strong> page (/events) to see heart buttons on all experience cards</li>
                <li>Visit the <strong>Home page</strong> (/) to see heart buttons on featured experience cards</li>
                <li>Click a heart button as a non-authenticated user - should show registration modal</li>
                <li>Sign in and click a heart button - should toggle between outlined and filled states</li>
                <li>Check your <strong>Saved Events</strong> page (/saved) to see favorited experiences</li>
                <li>Test hover effects and animations on the heart buttons</li>
                <li>Verify the heart button doesn't interfere with clicking the experience card link</li>
              </ol>

              <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-2">Expected Behavior</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Heart appears in top-right corner with semi-transparent white background</li>
                  <li>• Heart changes from outlined to filled red when favorited</li>
                  <li>• Smooth hover and click animations</li>
                  <li>• Non-authenticated users see registration modal</li>
                  <li>• Favorited events appear in Saved Events page</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TestFavorites; 