import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Mail,
  Wallet,
  Calendar,
  Users,
  DollarSign,
  Clock
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const AdminPayouts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Calculate period dates
  const getPeriodDates = (period: string) => {
    const now = new Date();
    switch (period) {
      case "current":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case "last":
        const lastMonth = subMonths(now, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth)
        };
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
    }
  };

  const { start: periodStart, end: periodEnd } = getPeriodDates(selectedPeriod);

  // Fetch all hosts with events - enhanced to handle completed vs upcoming events
  const { data: allHostsWithEvents, isLoading: hostsLoading, refetch } = useQuery({
    queryKey: ['all-hosts-with-events', selectedPeriod],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all hosts who have created events, regardless of period
      const { data: allHostsData, error: hostsError } = await supabase
        .from('events')
        .select(`
          host_id,
          date,
          profiles!inner(id, full_name, iban, account_holder_name, payout_details_completed)
        `)
        .not('host_id', 'is', null);

      if (hostsError) throw hostsError;

      // Group by host and get unique hosts
      const hostsMap = new Map();
      allHostsData?.forEach((event: any) => {
        const hostId = event.host_id;
        if (!hostsMap.has(hostId)) {
          hostsMap.set(hostId, {
            host_id: hostId,
            host_name: event.profiles.full_name,
            has_payout_details: !!(event.profiles.iban && event.profiles.account_holder_name),
            gross_amount: 0,
            commission_amount: 0,
            net_amount: 0,
            event_count: 0,
            completed_events: 0,
            upcoming_events: 0,
            payout_status: 'no_events'
          });
        }
        
        // Count completed vs upcoming events
        const hostEntry = hostsMap.get(hostId);
        if (new Date(event.date) < new Date(today)) {
          hostEntry.completed_events++;
        } else {
          hostEntry.upcoming_events++;
        }
      });

      // Calculate payouts only for completed events within the selected period
      const { data: payoutData, error: payoutError } = await supabase
        .from('bookings')
        .select(`
          total_amount,
          events!inner(host_id, date)
        `)
        .gte('events.date', format(periodStart, 'yyyy-MM-dd'))
        .lte('events.date', format(periodEnd, 'yyyy-MM-dd'))
        .lt('events.date', today) // Only completed events
        .eq('status', 'confirmed');
      
      if (payoutError) console.error('Payout calculation error:', payoutError);

      // Group payouts by host
      const hostPayouts = new Map();
      payoutData?.forEach((booking: any) => {
        const hostId = booking.events.host_id;
        if (!hostPayouts.has(hostId)) {
          hostPayouts.set(hostId, {
            gross_amount: 0,
            event_count: 0
          });
        }
        const payout = hostPayouts.get(hostId);
        payout.gross_amount += Number(booking.total_amount || 0);
        payout.event_count++;
      });

      // Update hosts with payout data and determine status
      const hostsWithPayouts = Array.from(hostsMap.values());
      
      hostsWithPayouts.forEach((host: any) => {
        const payoutData = hostPayouts.get(host.host_id);
        if (payoutData) {
          host.gross_amount = payoutData.gross_amount;
          host.commission_amount = payoutData.gross_amount * 0.1;
          host.net_amount = payoutData.gross_amount * 0.9;
          host.event_count = payoutData.event_count;
          
          // Determine payout status
          if (host.net_amount >= 50) {
            host.payout_status = host.has_payout_details ? 'ready' : 'missing_details';
          } else if (host.net_amount > 0) {
            host.payout_status = 'below_minimum';
          } else {
            host.payout_status = host.completed_events > 0 ? 'no_pending' : 'no_completed';
          }
        } else {
          // No payouts for this period
          host.payout_status = host.completed_events > 0 ? 'no_pending' : 'no_completed';
        }
      });

      return hostsWithPayouts;
    }
  });

  // Fetch payout history
  const { data: payoutHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['payout-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          profiles!host_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Mark payout as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async ({ hostId, amount, reference }: { hostId: string, amount: number, reference: string }) => {
      const { error } = await supabase
        .from('payouts')
        .insert({
          host_id: hostId,
          period_start: format(periodStart, 'yyyy-MM-dd'),
          period_end: format(periodEnd, 'yyyy-MM-dd'),
          gross_amount: amount / 0.9, // Reverse calculate gross
          commission_amount: (amount / 0.9) * 0.1,
          net_amount: amount,
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_reference: reference
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-hosts-with-events'] });
      queryClient.invalidateQueries({ queryKey: ['payout-history'] });
      toast({
        title: "Payout marked as paid",
        description: "The payout has been successfully recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark payout as paid. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getPayoutStatusBadge = (status: string, netAmount: number) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready to Pay</Badge>;
      case 'missing_details':
        return <Badge variant="destructive">Missing Bank Details</Badge>;
      case 'below_minimum':
        return <Badge className="bg-yellow-100 text-yellow-800">Below €50 Minimum</Badge>;
      case 'no_pending':
        return <Badge variant="outline">No Pending Payouts</Badge>;
      case 'no_completed':
        return <Badge variant="secondary">No Completed Events</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getPayoutAmount = (host: any) => {
    // Only show amounts for completed events
    if (host.completed_events === 0) {
      return "No completed events";
    }
    
    if (host.net_amount === 0) {
      return "€0.00";
    }

    // Show pending amount only if event is completed
    return formatCurrency(Number(host.net_amount));
  };

  const formatCurrency = (amount: number) => `€${Number(amount).toFixed(2)}`;

  const getBankDetailsDisplay = (hasDetails: boolean) => {
    if (hasDetails) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">••••4512 ✓</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-red-600">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-sm">Missing ⚠️</span>
      </div>
    );
  };

  const exportForBank = () => {
    if (!allHostsWithEvents) return;
    
    const csvContent = [
      ['Host Name', 'Bank Details', 'Amount', 'Reference'],
      ...allHostsWithEvents
        .filter(p => p.has_payout_details && p.net_amount > 0)
        .map(payout => [
          payout.host_name,
          '••••4512', // In real implementation, this would be actual IBAN
          formatCurrency(Number(payout.net_amount)),
          `PAYOUT-${format(new Date(), 'yyyyMM')}-${payout.host_id.slice(0, 8)}`
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `payouts-${format(new Date(), 'yyyy-MM')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalToPay = allHostsWithEvents?.reduce((sum, p) => sum + Number(p.net_amount), 0) || 0;
  const totalCommission = allHostsWithEvents?.reduce((sum, p) => sum + Number(p.commission_amount), 0) || 0;
  const hostsCount = allHostsWithEvents?.length || 0;
  const hostsWithPayouts = allHostsWithEvents?.filter(h => h.net_amount > 0).length || 0;
  const nextPayoutDate = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1), 'MMM do');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payout Management</h1>
          <p className="text-gray-600">Manage host payouts and commission tracking</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportForBank} size="sm" disabled={!allHostsWithEvents?.length}>
            <Download className="h-4 w-4 mr-2" />
            Export for Bank
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Next Payout Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextPayoutDate}</div>
            <p className="text-xs text-gray-500 mt-1">of each month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Total to Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalToPay)}</div>
            <p className="text-xs text-gray-500 mt-1">Net amount to hosts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Total Hosts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hostsCount}</div>
            <p className="text-xs text-gray-500 mt-1">{hostsWithPayouts} with pending payouts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Wallet className="h-4 w-4 mr-1" />
              Your Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-gray-500 mt-1">Commission retained</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">All Hosts ({hostsCount})</TabsTrigger>
          <TabsTrigger value="history">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Payout Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">This Month</SelectItem>
                      <SelectItem value="last">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hosts</SelectItem>
                      <SelectItem value="ready">Ready to Pay</SelectItem>
                      <SelectItem value="missing">Missing Details</SelectItem>
                      <SelectItem value="pending">With Pending Payouts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Min. Payout</label>
                  <Input value="€50.00" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Hosts Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Hosts with Events ({allHostsWithEvents?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {hostsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading hosts...</div>
                </div>
              ) : !allHostsWithEvents || allHostsWithEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hosts with events found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Host Name</TableHead>
                        <TableHead className="text-center">Events Status</TableHead>
                        <TableHead className="text-right">Gross Revenue</TableHead>
                        <TableHead className="text-right">Commission (10%)</TableHead>
                        <TableHead className="text-right">Net Payout</TableHead>
                        <TableHead className="text-center">Bank Details</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allHostsWithEvents
                        .filter(host => {
                          if (statusFilter === "ready") return host.payout_status === 'ready';
                          if (statusFilter === "missing") return host.payout_status === 'missing_details';
                          if (statusFilter === "pending") return host.net_amount > 0;
                          return true;
                        })
                        .map((host) => (
                          <TableRow key={host.host_id} className={host.net_amount === 0 ? "bg-gray-50" : ""}>
                            <TableCell className="font-medium">{host.host_name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-2">
                                {host.completed_events > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {host.completed_events} completed
                                  </Badge>
                                )}
                                {host.upcoming_events > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {host.upcoming_events} upcoming
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(Number(host.gross_amount))}</TableCell>
                            <TableCell className="text-right">{formatCurrency(Number(host.commission_amount))}</TableCell>
                            <TableCell className="text-right font-medium">
                              {getPayoutAmount(host)}
                            </TableCell>
                            <TableCell className="text-center">
                              {getBankDetailsDisplay(host.has_payout_details)}
                            </TableCell>
                            <TableCell className="text-center">
                              {host.payout_status === 'ready' ? (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const reference = prompt("Enter payment reference:");
                                    if (reference) {
                                      markAsPaidMutation.mutate({
                                        hostId: host.host_id,
                                        amount: Number(host.net_amount),
                                        reference
                                      });
                                    }
                                  }}
                                  disabled={markAsPaidMutation.isPending}
                                >
                                  Mark as Paid
                                </Button>
                              ) : host.payout_status === 'missing_details' && host.net_amount > 0 ? (
                                <Button size="sm" variant="outline">
                                  Request Details
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  {host.payout_status === 'below_minimum' ? "Below minimum" : "No action needed"}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading history...</div>
                </div>
              ) : !payoutHistory || payoutHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No payout history yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date Paid</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payoutHistory.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>
                            {payout.paid_at ? format(new Date(payout.paid_at), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                          <TableCell>{payout.profiles?.full_name || 'Unknown'}</TableCell>
                          <TableCell>
                            {format(new Date(payout.period_start), 'MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(Number(payout.net_amount))}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {payout.payment_reference || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={payout.status === 'paid' ? 'default' : 'secondary'}>
                              {payout.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayouts;
