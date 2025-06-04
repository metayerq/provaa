
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Send, 
  Eye, 
  BarChart3,
  TestTube,
  Download,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import { EmailMetrics } from './types';
import { toast } from '@/hooks/use-toast';

interface OverviewTabProps {
  metrics?: EmailMetrics;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ metrics }) => {
  // Provide default values if metrics is undefined
  const defaultMetrics: EmailMetrics = {
    emailsSent: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribes: 0
  };

  const safeMetrics = metrics || defaultMetrics;

  const handleTestTemplates = () => {
    toast({
      title: "Testing Templates",
      description: "Use the Email System Testing section below to test individual templates.",
    });
  };

  const handleExportAnalytics = () => {
    toast({
      title: "Export Analytics",
      description: "Analytics export feature coming soon.",
    });
  };

  const handleSuppressionList = () => {
    toast({
      title: "Suppression List",
      description: "Suppression list management coming soon.",
    });
  };

  const handleViewLogs = () => {
    window.open('https://supabase.com/dashboard/project/vsianzkmvbbaahoeivnx/functions', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeMetrics.emailsSent}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeMetrics.deliveryRate}%</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeMetrics.openRate}%</div>
            <p className="text-xs text-muted-foreground">Recipients opened</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeMetrics.clickRate}%</div>
            <p className="text-xs text-muted-foreground">Recipients clicked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeMetrics.unsubscribes}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>From Name:</span>
                  <span className="font-medium">Provaa</span>
                </div>
                <div className="flex justify-between">
                  <span>From Email:</span>
                  <span className="font-medium">hello@provaa.co</span>
                </div>
                <div className="flex justify-between">
                  <span>Reply-To:</span>
                  <span className="font-medium">support@provaa.co</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Domain & Provider</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-800">Resend ✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-800">provaa.co ✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-800">Verified</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={handleTestTemplates}
            >
              <TestTube className="h-5 w-5" />
              Test Templates
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={handleExportAnalytics}
            >
              <Download className="h-5 w-5" />
              Export Analytics
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={handleSuppressionList}
            >
              <Users className="h-5 w-5" />
              Suppression List
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-2 p-4"
              onClick={handleViewLogs}
            >
              <Clock className="h-5 w-5" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
