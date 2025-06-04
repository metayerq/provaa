
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface EmailStats {
  totalSent: number;
  deliveryRate: number;
  scheduledEmails: number;
  failedEmails: number;
  recentActivity: Array<{
    id: string;
    type: string;
    status: string;
    recipient: string;
    sent_at: string;
    template_name: string;
  }>;
}

export const EmailAutomationStatus: React.FC = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadEmailStats = async () => {
    try {
      setIsLoading(true);

      // Get email logs directly from the table
      const { data: emailLogs, error: logsError } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false });

      if (logsError) {
        console.error('Error fetching email logs:', logsError);
      }

      // Get scheduled emails count
      const { data: scheduledEmails, error: scheduledError } = await supabase
        .from('scheduled_emails')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      if (scheduledError) {
        console.error('Error fetching scheduled emails:', scheduledError);
      }

      // Process the data safely
      const logs = emailLogs || [];
      const totalSent = logs.length;
      const successfulEmails = logs.filter(log => log.status === 'sent').length;
      const deliveryRate = totalSent > 0 ? (successfulEmails / totalSent) * 100 : 0;
      const failedEmails = logs.filter(log => log.status === 'failed').length;

      // Get recent activity
      const recentActivity = logs.slice(0, 10).map(log => ({
        id: log.id,
        type: log.template_id,
        status: log.status,
        recipient: log.recipient_email,
        sent_at: log.sent_at,
        template_name: log.template_id
      }));

      setStats({
        totalSent,
        deliveryRate: Math.round(deliveryRate),
        scheduledEmails: scheduledEmails?.length || 0,
        failedEmails,
        recentActivity
      });

    } catch (error: any) {
      console.error('Error loading email stats:', error);
      toast({
        title: "Error",
        description: "Failed to load email statistics.",
        variant: "destructive",
      });
      
      // Set default stats on error
      setStats({
        totalSent: 0,
        deliveryRate: 0,
        scheduledEmails: 0,
        failedEmails: 0,
        recentActivity: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processScheduledEmails = async () => {
    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('process-scheduled-emails');
      
      if (error) throw error;

      toast({
        title: "Scheduled Emails Processed",
        description: `Processed ${data?.processed || 0} emails successfully.`,
      });

      // Reload stats
      await loadEmailStats();

    } catch (error: any) {
      console.error('Error processing scheduled emails:', error);
      toast({
        title: "Error",
        description: "Failed to process scheduled emails.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    loadEmailStats();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{stats?.totalSent || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-2xl font-bold">{stats?.deliveryRate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">{stats?.scheduledEmails || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold">{stats?.failedEmails || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={loadEmailStats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Stats
        </Button>
        <Button 
          onClick={processScheduledEmails} 
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Process Scheduled Emails
            </>
          )}
        </Button>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Email Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.status === 'sent' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{activity.template_name}</p>
                      <p className="text-sm text-gray-600">to {activity.recipient}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === 'sent' ? 'default' : 'destructive'}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent email activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
