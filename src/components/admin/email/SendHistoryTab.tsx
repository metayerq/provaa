
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Send, Filter } from 'lucide-react';
import { SendHistoryItem } from './types';

interface SendHistoryTabProps {
  sendHistory: SendHistoryItem[];
}

export const SendHistoryTab: React.FC<SendHistoryTabProps> = ({ sendHistory }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Send History</h2>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Sent</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sendHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.dateSent}</TableCell>
                  <TableCell className="font-medium">{item.template}</TableCell>
                  <TableCell>{item.recipients}</TableCell>
                  <TableCell>
                    {item.delivered ? (
                      <Badge className="bg-green-100 text-green-800">✓</Badge>
                    ) : (
                      <Badge variant="destructive">✗</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.opened ? (
                      <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.clicked ? (
                      <Badge className="bg-purple-100 text-purple-800">✓</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
