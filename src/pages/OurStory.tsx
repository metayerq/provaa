import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, MapPin, Sparkles, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const OurStory = () => {
  const milestones = [
    {
      year: '2023',
      title: 'The Beginning',
      description: 'Founded with a vision to connect people through authentic local experiences and meaningful gatherings.',
      icon: Heart
    },
    {
      year: '2024',
      title: 'Growing Community',
      description: 'Reached 1,000+ hosts and 10,000+ happy attendees across multiple cities.',
      icon: Users
    },
    {
      year: '2024',
      title: 'Going Global',
      description: 'Expanded to serve communities worldwide, making authentic experiences accessible everywhere.',
      icon: Globe
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Authentic Connections',
      description: 'We believe in creating genuine human connections through shared experiences and local culture.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our platform is built by the community, for the community. Every decision prioritizes our users.'
    },
    {
      icon: Sparkles,
      title: 'Quality Experiences',
      description: 'We curate and support only the highest quality experiences that create lasting memories.'
    },
    {
      icon: Award,
      title: 'Trust & Safety',
      description: 'Creating a safe, inclusive environment where everyone can explore and share without worry.'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-orange-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Heart className="h-10 w-10 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                We started Provaa with a simple belief: the best experiences happen when people come together 
                to share their passions, skills, and cultures in authentic, meaningful ways.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why We Started Provaa
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  In a world where digital connections often feel shallow, we noticed people craving 
                  real, in-person experiences that create lasting memories and genuine friendships.
                </p>
                <p>
                  We saw talented hosts struggling to share their passions, while experience-seekers 
                  had limited options beyond tourist traps and generic activities.
                </p>
                <p>
                  Provaa bridges this gap by empowering anyone to host unique experiences and 
                  connecting them with people who share their interests and curiosity.
                </p>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-emerald-100 to-orange-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "To create a world where everyone can easily discover, share, and participate in 
                  authentic local experiences that build community and create lasting connections."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From idea to community - here's how we've grown together.
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <milestone.icon className="h-6 w-6 text-emerald-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-2xl font-bold text-emerald-700">{milestone.year}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                      <value.icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Story
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Whether you're hosting your first experience or looking for your next adventure, 
                you're part of what makes Provaa special.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-emerald-700 hover:bg-gray-100">
                  <Link to="/host/events/create">Start Hosting</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-700">
                  <Link to="/events">Find Experiences</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OurStory; 