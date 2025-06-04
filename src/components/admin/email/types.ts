
export interface EmailMetrics {
  emailsSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribes: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'Transactional' | 'Automated';
  status: 'Active' | 'Draft';
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface AutomationRule {
  id: string;
  trigger: string;
  template: string;
  timing: string;
  recipients: string;
  status: 'Active' | 'Draft';
}

export interface SendHistoryItem {
  id: string;
  dateSent: string;
  template: string;
  recipients: string;
  delivered: boolean;
  opened: boolean;
  clicked: boolean;
}
