import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  RefreshCw,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  BarChart3,
  Star
} from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard-comprehensive-metrics'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const thisWeekStart = new Date();
      thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString();
      const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString();
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Financial metrics for different periods
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .gte('created_at', today + ' 00:00:00')
        .lt('created_at', today + ' 23:59:59')
        .eq('status', 'confirmed');

      const { data: weekBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .gte('created_at', thisWeekStart.toISOString())
        .eq('status', 'confirmed');

      const { data: monthBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .gte('created_at', thisMonthStart)
        .eq('status', 'confirmed');

      const { data: lastMonthBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .gte('created_at', lastMonthStart)
        .lt('created_at', thisMonthStart)
        .eq('status', 'confirmed');

      const { data: allTimeBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed');

      // Booking counts
      const { count: todayBookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today + ' 00:00:00')
        .lt('created_at', today + ' 23:59:59')
        .eq('status', 'confirmed');

      const { count: weekBookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisWeekStart.toISOString())
        .eq('status', 'confirmed');

      const { count: monthBookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart)
        .eq('status', 'confirmed');

      const { count: lastMonthBookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart)
        .lt('created_at', thisMonthStart)
        .eq('status', 'confirmed');

      const { count: allTimeBookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'confirmed');

      // Pending host payouts calculation - only for completed events
      const { data: completedEventsBookings } = await supabase
        .from('bookings')
        .select(`
          total_amount,
          events!inner(date, host_id)
        `)
        .eq('status', 'confirmed')
        .lt('events.date', today);

      // Active hosts - hosts with upcoming events OR events in last 30 days
      const { data: activeHostsData } = await supabase
        .from('events')
        .select('host_id')
        .or(`date.gte.${today},date.gte.${last30Days}`)
        .not('host_id', 'is', null);

      const uniqueActiveHosts = new Set(activeHostsData?.map(e => e.host_id)).size;

      // Total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Upcoming events
      const { count: upcomingEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', today);

      // Top revenue event calculation
      const { data: eventsWithRevenue } = await supabase
        .from('bookings')
        .select(`
          event_id,
          total_amount,
          events!inner(title, host_id, price, date),
          profiles!inner(full_name)
        `)
        .gte('created_at', thisMonthStart)
        .eq('status', 'confirmed');

      // Group by event and calculate total revenue
      const eventRevenues = eventsWithRevenue?.reduce((acc: any, booking: any) => {
        const eventId = booking.event_id;
        if (!acc[eventId]) {
          acc[eventId] = {
            title: booking.events.title,
            host_name: booking.profiles.full_name,
            total_revenue: 0
          };
        }
        acc[eventId].total_revenue += Number(booking.total_amount || 0);
        return acc;
      }, {});

      const topEvent = eventRevenues ? 
        Object.values(eventRevenues).sort((a: any, b: any) => b.total_revenue - a.total_revenue)[0] : null;

      // Popular categories calculation - fix TypeScript error
      const { data: categoryBookings } = await supabase
        .from('bookings')
        .select(`
          events!inner(category)
        `)
        .eq('status', 'confirmed');

      const categoryCounts = categoryBookings?.reduce((acc: Record<string, number>, booking: any) => {
        const category = booking.events.category || 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const totalCategoryBookings = Object.values(categoryCounts || {}).reduce((sum: number, count: number) => sum + count, 0);
      const popularCategories = Object.entries(categoryCounts || {})
        .map(([category, count]) => ({
          category,
          count,
          percentage: totalCategoryBookings > 0 ? Math.round((count / totalCategoryBookings) * 100) : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      // User growth calculation
      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart);

      const { count: newUsersLastMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonthStart)
        .lt('created_at', thisMonthStart);

      const userGrowthRate = (newUsersLastMonth || 0) > 0 ? 
        Math.round(((newUsersThisMonth || 0) - (newUsersLastMonth || 0)) / (newUsersLastMonth || 1) * 100) : 0;

      // Cancellation rate calculation
      const { count: cancelledBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'cancelled');

      const { count: totalBookingsEver } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const cancellationRate = (totalBookingsEver || 0) > 0 ? 
        Math.round((cancelledBookings || 0) / (totalBookingsEver || 1) * 100) : 0;

      // Calculate revenue sums
      const todayRevenue = todayBookings?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0;
      const weekRevenue = weekBookings?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0;
      const monthRevenue = monthBookings?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0;
      const lastMonthRevenue = lastMonthBookings?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0;
      const allTimeRevenue = allTimeBookings?.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0) || 0;

      // Calculate pending host payouts (only for completed events)
      const pendingHostPayouts = completedEventsBookings?.reduce((sum, booking) => sum + Number(booking.total_amount || 0) * 0.9, 0) || 0;
      const platformCommission = allTimeRevenue * 0.1;

      return {
        financial: {
          today: { revenue: todayRevenue, bookings: todayBookingCount || 0 },
          week: { revenue: weekRevenue, bookings: weekBookingCount || 0 },
          month: { revenue: monthRevenue, bookings: monthBookingCount || 0 },
          lastMonth: { revenue: lastMonthRevenue, bookings: lastMonthBookingCount || 0 },
          allTime: { revenue: allTimeRevenue, bookings: allTimeBookingCount || 0 }
        },
        pendingHostPayouts,
        platformCommission,
        activeHosts: uniqueActiveHosts,
        totalUsers: totalUsers || 0,
        upcomingEvents: upcomingEvents || 0,
        topEvent,
        popularCategories,
        newUsersThisMonth: newUsersThisMonth || 0,
        userGrowthRate,
        cancellationRate
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const formatCurrency = (amount: number) => `€${amount.toFixed(2)}`;
  const formatCommission = (amount: number) => formatCurrency(amount * 0.1);

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <span className="h-4 w-4 text-gray-400">-</span>;
  };

  const exportFinancialReport = () => {
    if (!metrics) return;

    const csvContent = [
      ['Period', 'Turnover', 'Commission (10%)', 'Bookings'],
      ['Today', formatCurrency(metrics.financial.today.revenue), formatCommission(metrics.financial.today.revenue), metrics.financial.today.bookings],
      ['This Week', formatCurrency(metrics.financial.week.revenue), formatCommission(metrics.financial.week.revenue), metrics.financial.week.bookings],
      ['This Month', formatCurrency(metrics.financial.month.revenue), formatCommission(metrics.financial.month.revenue), metrics.financial.month.bookings],
      ['Last Month', formatCurrency(metrics.financial.lastMonth.revenue), formatCommission(metrics.financial.lastMonth.revenue), metrics.financial.lastMonth.bookings],
      ['All Time', formatCurrency(metrics.financial.allTime.revenue), formatCommission(metrics.financial.allTime.revenue), metrics.financial.allTime.bookings]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading comprehensive metrics...</div>
      </div>
    );
  }

  const avgBookingValue = metrics?.financial.month.bookings > 0 
    ? metrics.financial.month.revenue / metrics.financial.month.bookings 
    : 0;

  const allTimeAvgBookingValue = metrics?.financial.allTime.bookings > 0 
    ? metrics.financial.allTime.revenue / metrics.financial.allTime.bookings 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Comprehensive platform metrics and financial overview</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportFinancialReport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Main Financial Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Turnover</TableHead>
                  <TableHead className="text-right">Commission (10%)</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-medium">Today</TableCell>
                  <TableCell className="text-right">{formatCurrency(metrics?.financial.today.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{formatCommission(metrics?.financial.today.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{metrics?.financial.today.bookings || 0}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">This Week</TableCell>
                  <TableCell className="text-right">{formatCurrency(metrics?.financial.week.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{formatCommission(metrics?.financial.week.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{metrics?.financial.week.bookings || 0}</TableCell>
                  <TableCell className="text-right">
                    {getTrendIcon(metrics?.financial.week.revenue || 0, metrics?.financial.lastMonth.revenue || 0)}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-gray-50">
                  <TableCell className="font-medium">This Month</TableCell>
                  <TableCell className="text-right">{formatCurrency(metrics?.financial.month.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{formatCommission(metrics?.financial.month.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{metrics?.financial.month.bookings || 0}</TableCell>
                  <TableCell className="text-right">
                    {getTrendIcon(metrics?.financial.month.revenue || 0, metrics?.financial.lastMonth.revenue || 0)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Last Month</TableCell>
                  <TableCell className="text-right">{formatCurrency(metrics?.financial.lastMonth.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{formatCommission(metrics?.financial.lastMonth.revenue || 0)}</TableCell>
                  <TableCell className="text-right">{metrics?.financial.lastMonth.bookings || 0}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
                <TableRow className="bg-blue-50 font-bold">
                  <TableCell className="font-bold">All Time</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(metrics?.financial.allTime.revenue || 0)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCommission(metrics?.financial.allTime.revenue || 0)}</TableCell>
                  <TableCell className="text-right font-bold">{metrics?.financial.allTime.bookings || 0}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Pending Host Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {formatCurrency(metrics?.pendingHostPayouts || 0)}
            </div>
            <p className="text-xs text-yellow-700 mt-1">Due for completed events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Average Booking Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgBookingValue)}</div>
            <p className="text-xs text-gray-500 mt-1">
              All Time: {formatCurrency(allTimeAvgBookingValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Coming Soon</div>
            <p className="text-xs text-gray-500 mt-1">Views to bookings tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Active Hosts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeHosts || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.totalUsers || 0} total users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Top Revenue Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {(metrics?.topEvent as any)?.title || 'No events yet'}
            </div>
            <p className="text-sm text-gray-500">
              {metrics?.topEvent ? formatCurrency((metrics.topEvent as any).total_revenue) : '€0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {metrics?.popularCategories?.map((cat: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{cat.category}</span>
                  <span>{cat.percentage}%</span>
                </div>
              )) || (
                <div className="text-sm text-gray-500">No data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{metrics?.newUsersThisMonth || 0} new</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.totalUsers || 0} total • {metrics?.userGrowthRate > 0 ? '+' : ''}{metrics?.userGrowthRate || 0}% growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Upcoming events</span>
                <span>{metrics?.upcomingEvents || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cancellation rate</span>
                <span>{metrics?.cancellationRate || 0}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Disputes</span>
                <span>0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="bg-green-50 border-green-200 text-green-700">
              Process Payouts
            </Button>
            <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
              View Pending Verifications
            </Button>
            <Button variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              Export Tax Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last updated info */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {format(new Date(), 'HH:mm')} • Auto-refresh every 5 minutes
      </div>
    </div>
  );
};

export default AdminDashboard;
