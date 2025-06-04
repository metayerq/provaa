
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Play, Pause, Plus } from 'lucide-react';
import { AutomationRule } from './types';
import { CreateAutomationDialog } from './dialogs/CreateAutomationDialog';
import { toast } from '@/hooks/use-toast';

interface AutomationTabProps {
  automationRules: AutomationRule[];
}

export const AutomationTab: React.FC<AutomationTabProps> = ({ automationRules: initialRules }) => {
  const [automationRules, setAutomationRules] = useState(initialRules);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateAutomation = (newAutomation: AutomationRule) => {
    setAutomationRules([...automationRules, newAutomation]);
  };

  const handleEditRule = (ruleId: string) => {
    toast({
      title: "Edit Rule",
      description: "Automation rule editor will open here.",
    });
  };

  const handleToggleRule = (ruleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Draft' : 'Active';
    setAutomationRules(automationRules.map(rule => 
      rule.id === ruleId ? { ...rule, status: newStatus as 'Active' | 'Draft' } : rule
    ));
    
    toast({
      title: `Rule ${newStatus === 'Active' ? 'Activated' : 'Deactivated'}`,
      description: `Automation rule has been ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Automation Rules</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Rule
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trigger</TableHead>
                <TableHead>Email Template</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automationRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.trigger}</TableCell>
                  <TableCell>{rule.template}</TableCell>
                  <TableCell>{rule.timing}</TableCell>
                  <TableCell>{rule.recipients}</TableCell>
                  <TableCell>
                    <Badge variant={rule.status === 'Active' ? 'default' : 'secondary'}>
                      {rule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditRule(rule.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleRule(rule.id, rule.status)}
                      >
                        {rule.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateAutomationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAutomationCreated={handleCreateAutomation}
      />
    </div>
  );
};
