import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, Video, Users, TrendingUp, Calendar, Mail } from 'lucide-react';

const PressKit = () => {
  const companyFacts = [
    { label: 'Founded', value: '2023' },
    { label: 'Headquarters', value: 'Lisbon, Portugal' },
    { label: 'Active Markets', value: '15+ Cities' },
    { label: 'Total Experiences', value: '500+' },
    { label: 'Community Size', value: '10,000+ Users' },
    { label: 'Funding Status', value: 'Seed Stage' }
  ];

  const downloadableAssets = [
    {
      type: 'logos',
      title: 'Logo Package',
      description: 'High-resolution logos in various formats (SVG, PNG, JPG)',
      icon: Image,
      fileSize: '2.4 MB',
      formats: ['SVG', 'PNG', 'JPG']
    },
    {
      type: 'brand',
      title: 'Brand Guidelines',
      description: 'Complete brand guide including colors, typography, and usage guidelines',
      icon: FileText,
      fileSize: '1.8 MB',
      formats: ['PDF']
    },
    {
      type: 'screenshots',
      title: 'Product Screenshots',
      description: 'High-quality screenshots of our platform and mobile app',
      icon: Image,
      fileSize: '5.2 MB',
      formats: ['PNG', 'JPG']
    },
    {
      type: 'video',
      title: 'Company Video',
      description: 'Introduction video showcasing our mission and platform',
      icon: Video,
      fileSize: '15 MB',
      formats: ['MP4']
    }
  ];

  const pressReleases = [
    {
      date: '2024-01-15',
      title: 'Provaa Raises €2M Seed Round to Expand Community-Driven Experience Platform',
      summary: 'Funding will accelerate expansion into new European markets and enhance platform features.',
      link: '#'
    },
    {
      date: '2023-11-20',
      title: 'Provaa Launches in 10 New Cities Across Europe',
      summary: 'Platform expansion brings authentic local experiences to thousands of new users.',
      link: '#'
    },
    {
      date: '2023-09-05',
      title: 'Provaa Partners with Local Tourism Boards to Promote Authentic Travel',
      summary: 'Strategic partnerships aim to showcase hidden gems and support local communities.',
      link: '#'
    }
  ];

  const mediaContacts = [
    {
      name: 'Sarah Johnson',
      title: 'Head of Communications',
      email: 'press@provaa.co',
      phone: '+351 123 456 789'
    },
    {
      name: 'Marketing Team',
      title: 'General Inquiries',
      email: 'media@provaa.co',
      phone: '+351 987 654 321'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <FileText className="h-10 w-10 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Press Kit
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Media resources, company information, and downloadable assets for journalists, 
                bloggers, and media professionals covering Provaa.
              </p>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Provaa
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Provaa is a community-driven platform that connects people through authentic local experiences. 
                  We empower anyone to become a host and share their passions, skills, and local knowledge with others.
                </p>
                <p>
                  From cooking classes in local homes to guided photography walks and artisan workshops, 
                  Provaa offers experiences that go beyond traditional tourism to create genuine connections 
                  and support local communities.
                </p>
                <p>
                  Founded in 2023 and based in Lisbon, Portugal, we're building the future of 
                  experience-based community building, one meaningful connection at a time.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Facts</h3>
              <div className="grid grid-cols-2 gap-4">
                {companyFacts.map((fact, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">
                        {fact.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {fact.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Downloadable Assets */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Downloadable Assets
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                High-quality assets for media coverage, including logos, brand materials, and product screenshots.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {downloadableAssets.map((asset, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <asset.icon className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{asset.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{asset.fileSize}</span>
                          <div className="flex space-x-1">
                            {asset.formats.map((format, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {asset.description}
                    </p>
                    <Button className="w-full bg-emerald-700 hover:bg-emerald-800">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Press Releases */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Press Releases
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recent news and announcements from Provaa.
            </p>
          </div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <Card key={index} className="border-l-4 border-l-emerald-700 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {new Date(release.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {release.title}
                      </h3>
                      <p className="text-gray-600">
                        {release.summary}
                      </p>
                    </div>
                    <Button variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                      Read Full Release
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Media Contacts */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Media Contacts
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get in touch with our media team for interviews, quotes, or additional information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {mediaContacts.map((contact, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="bg-emerald-100 p-3 rounded-full w-fit mx-auto mb-4">
                      <Mail className="h-6 w-6 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {contact.title}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          {contact.email}
                        </a>
                      </div>
                      <div className="text-gray-600">
                        {contact.phone}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-gradient-to-br from-gray-100 to-emerald-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Usage Guidelines
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
              <p>
                When using Provaa's brand assets and materials, please follow these guidelines:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use our logo and brand assets as provided without modification</li>
                <li>Maintain clear space around logos and ensure proper contrast</li>
                <li>Reference our company name as "Provaa" (not "provaa" or "PROVAA")</li>
                <li>Contact our media team before using materials in commercial contexts</li>
              </ul>
              <p className="mt-6">
                For questions about brand usage or additional materials, reach out to our media team at{' '}
                <a href="mailto:press@provaa.co" className="text-emerald-700 hover:text-emerald-800 font-medium">
                  press@provaa.co
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PressKit; 