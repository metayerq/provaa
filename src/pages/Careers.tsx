import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Briefcase, Heart, Zap, Coffee, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const openPositions = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote / Lisbon',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Join our engineering team to build scalable platforms that connect communities worldwide.',
      requirements: ['5+ years React/Node.js', 'Experience with TypeScript', 'Knowledge of cloud platforms'],
      salary: '€60,000 - €80,000'
    },
    {
      id: 2,
      title: 'Community Manager',
      department: 'Community',
      location: 'Remote / Lisbon',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Help grow and nurture our community of hosts and experience seekers across multiple markets.',
      requirements: ['3+ years community management', 'Social media expertise', 'Event planning experience'],
      salary: '€35,000 - €45,000'
    },
    {
      id: 3,
      title: 'Product Designer (UX/UI)',
      department: 'Design',
      location: 'Remote / Lisbon',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Design intuitive experiences that make it easy for people to discover and book amazing experiences.',
      requirements: ['4+ years product design', 'Figma proficiency', 'Mobile-first design approach'],
      salary: '€45,000 - €60,000'
    }
  ];

  const benefits = [
    {
      icon: Laptop,
      title: 'Remote-First Culture',
      description: 'Work from anywhere in the world with flexible hours and async communication.'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness stipend.'
    },
    {
      icon: Zap,
      title: 'Learning & Growth',
      description: '€2,000 annual learning budget, conference attendance, and skill development time.'
    },
    {
      icon: Coffee,
      title: 'Experience Credits',
      description: 'Monthly credits to book experiences on Provaa and explore your local community.'
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments', count: openPositions.length },
    { id: 'Engineering', name: 'Engineering', count: openPositions.filter(p => p.department === 'Engineering').length },
    { id: 'Design', name: 'Design', count: openPositions.filter(p => p.department === 'Design').length },
    { id: 'Community', name: 'Community', count: openPositions.filter(p => p.department === 'Community').length }
  ];

  const filteredPositions = selectedDepartment === 'all' 
    ? openPositions 
    : openPositions.filter(position => position.department === selectedDepartment);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Users className="h-10 w-10 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                We're Hiring!
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join our mission to connect people through authentic experiences. 
                We're building the future of community-driven discovery, and we'd love you to be part of it.
              </p>
              <div className="mt-8">
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-lg px-8 py-3">
                  <Link to="#open-positions">View Open Positions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Join Us Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Join Provaa?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're more than just a startup - we're a community of passionate people building something meaningful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-emerald-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div id="open-positions" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Open Positions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find your next adventure with us. All positions are open to remote candidates.
              </p>
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {departments.map((dept) => (
                <Button
                  key={dept.id}
                  variant={selectedDepartment === dept.id ? "default" : "outline"}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={selectedDepartment === dept.id ? "bg-emerald-700 hover:bg-emerald-800" : ""}
                >
                  {dept.name} ({dept.count})
                </Button>
              ))}
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredPositions.map((position) => (
                <Card key={position.id} className="border-l-4 border-l-emerald-700 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          {position.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                            {position.department}
                          </Badge>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {position.location}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {position.type}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {position.experience}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 mb-2">
                          {position.salary}
                        </div>
                        <Button className="bg-emerald-700 hover:bg-emerald-800">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {position.description}
                    </p>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Requirements:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {position.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Culture Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Culture
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  We believe that diverse teams build better products. We're committed to creating 
                  an inclusive environment where everyone can do their best work.
                </p>
                <p>
                  Our team spans different countries, backgrounds, and experiences, but we're united 
                  by our passion for connecting people and building meaningful technology.
                </p>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-purple-100 to-emerald-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Don't see a position that fits? We're always looking for talented people 
                  who share our vision. Send us your resume and tell us how you'd like to contribute.
                </p>
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers; 