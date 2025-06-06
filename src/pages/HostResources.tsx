import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Camera, 
  Calendar, 
  DollarSign, 
  Star, 
  MessageCircle, 
  Shield,
  FileText,
  Video,
  Download,
  ChefHat,
  Clock,
  MapPin,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HostResources = () => {
  const gettingStartedGuides = [
    {
      icon: BookOpen,
      title: "How to Create Your First Experience",
      description: "Step-by-step guide to setting up your first culinary experience on Provaa.",
      duration: "10 min read",
      category: "Getting Started",
      link: "#",
      difficulty: "Beginner"
    },
    {
      icon: Camera,
      title: "Photography Tips for Food Experiences",
      description: "Learn how to take stunning photos that make your experiences irresistible.",
      duration: "15 min read", 
      category: "Marketing",
      link: "#",
      difficulty: "Intermediate"
    },
    {
      icon: DollarSign,
      title: "Pricing Your Experience Right",
      description: "Strategies for competitive pricing that maximizes bookings and revenue.",
      duration: "12 min read",
      category: "Business",
      link: "#",
      difficulty: "Intermediate"
    },
    {
      icon: Users,
      title: "Managing Guest Expectations",
      description: "Best practices for communication and delivering exceptional experiences.",
      duration: "8 min read",
      category: "Guest Relations",
      link: "#",
      difficulty: "Beginner"
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: "Host Handbook (PDF)",
      description: "Complete guide covering everything from setup to advanced hosting tips.",
      fileSize: "2.4 MB",
      type: "PDF Download"
    },
    {
      icon: Video,
      title: "Video Tutorial Series",
      description: "Watch step-by-step videos on creating and managing successful experiences.",
      fileSize: "Online Course",
      type: "Video Content"
    },
    {
      icon: ChefHat,
      title: "Recipe Templates",
      description: "Downloadable templates for organizing your culinary experience menus.",
      fileSize: "1.2 MB",
      type: "Template Pack"
    },
    {
      icon: Camera,
      title: "Photography Checklist",
      description: "Essential shot list and lighting tips for food photography.",
      fileSize: "0.8 MB",
      type: "PDF Guide"
    }
  ];

  const successTips = [
    {
      icon: Star,
      title: "Maintain High Ratings",
      tips: [
        "Respond to guest messages within 2 hours",
        "Provide clear directions and parking info",
        "Have backup plans for dietary restrictions",
        "Follow up with guests after experiences"
      ]
    },
    {
      icon: Calendar,
      title: "Optimize Your Schedule",
      tips: [
        "Block out prep time before each experience",
        "Consider offering multiple time slots",
        "Plan seasonal menus in advance",
        "Update availability regularly"
      ]
    },
    {
      icon: MessageCircle,
      title: "Guest Communication",
      tips: [
        "Send welcome messages 24 hours before",
        "Include what to bring and expect",
        "Share your contact info for day-of questions",
        "Ask about allergies and preferences"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Legal",
      tips: [
        "Check local health regulations",
        "Consider liability insurance",
        "Keep first aid kit accessible",
        "Document food safety procedures"
      ]
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Host Community Forum",
      description: "Connect with other hosts, share tips, and get advice from experienced creators.",
      action: "Join Forum",
      link: "#"
    },
    {
      icon: Calendar,
      title: "1-on-1 Host Coaching",
      description: "Book a free consultation with our host success team for personalized guidance.",
      action: "Schedule Call",
      link: "#"
    },
    {
      icon: Heart,
      title: "Host Appreciation Program",
      description: "Exclusive perks, early access to features, and recognition for top hosts.",
      action: "Learn More",
      link: "#"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-orange-50">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <ChefHat className="h-10 w-10 text-emerald-700" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Host Resources
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Everything you need to create, manage, and grow successful culinary experiences. 
                From beginner guides to advanced strategies, we've got you covered.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800 text-lg px-8 py-3">
                  <Link to="/host/events/create">Create Experience</Link>
                </Button>
                <Button asChild variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-3">
                  <Link to="/contact">Get Host Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Guides */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started Guides
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Step-by-step guides to help you launch and optimize your culinary experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gettingStartedGuides.map((guide, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <guide.icon className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 mb-2">
                          {guide.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(guide.difficulty)}>
                            {guide.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-500">{guide.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200">
                      {guide.category}
                    </Badge>
                    <Button variant="outline" className="border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                      Read Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Downloadable Resources */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Downloadable Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Templates, checklists, and guides you can download and use right away.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                        <resource.icon className="h-6 w-6 text-emerald-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {resource.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{resource.type}</Badge>
                            <span className="text-sm text-gray-500">{resource.fileSize}</span>
                          </div>
                          <Button className="bg-emerald-700 hover:bg-emerald-800">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Success Tips */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Tips
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proven strategies from our most successful hosts to help you thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successTips.map((section, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-100 p-3 rounded-full">
                      <section.icon className="h-6 w-6 text-emerald-700" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support & Community */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Support & Community
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                You're not alone on your hosting journey. Connect with our community and get expert support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportOptions.map((option, index) => (
                <Card key={index} className="border-0 shadow-lg text-center">
                  <CardContent className="p-8">
                    <div className="bg-emerald-100 p-4 rounded-full w-fit mx-auto mb-4">
                      <option.icon className="h-8 w-8 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {option.description}
                    </p>
                    <Button className="w-full bg-emerald-700 hover:bg-emerald-800">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Hosting?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of hosts who are sharing their passion and building successful 
                culinary experiences on Provaa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-3">
                  <Link to="/host/events/create">Create Your First Experience</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-3">
                  <Link to="/host/events">Manage Experiences</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HostResources; 