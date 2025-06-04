
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './email/OverviewTab';
import { TemplatesTab } from './email/TemplatesTab';
import { AutomationTab } from './email/AutomationTab';
import { SendHistoryTab } from './email/SendHistoryTab';
import { EmailTestPanel } from './EmailTestPanel';
import { EmailAutomationStatus } from './email/components/EmailAutomationStatus';
import { EmailMetrics, AutomationRule, SendHistoryItem } from './email/types';

export const EmailNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data to satisfy component requirements
  const mockMetrics: EmailMetrics = {
    emailsSent: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribes: 0
  };

  const mockAutomationRules: AutomationRule[] = [];
  const mockSendHistory: SendHistoryItem[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Notifications</h1>
        <p className="text-gray-600 mt-2">
          Manage email templates, automation rules, and notification settings.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="history">Send History</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab metrics={mockMetrics} />
          <EmailTestPanel />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <AutomationTab automationRules={mockAutomationRules} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <SendHistoryTab sendHistory={mockSendHistory} />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <EmailAutomationStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};
