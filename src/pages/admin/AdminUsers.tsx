
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Check, X, Ban, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectingUserId, setRejectingUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingHosts, isLoading: loadingHosts } = useQuery({
    queryKey: ['admin-pending-hosts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('user_type', ['host', 'both'])
        .eq('verified', false)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: allUsers, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-all-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  const verifyHostMutation = useMutation({
    mutationFn: async ({ userId, verified }: { userId: string; verified: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ verified })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, { verified }) => {
      toast({
        title: verified ? "Host verified successfully" : "Host verification revoked",
        description: verified ? "The host has been verified and can now create events" : "Host verification has been revoked",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-hosts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update host verification status",
        variant: "destructive",
      });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, suspended }: { userId: string; suspended: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ suspended })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: (_, { suspended }) => {
      toast({
        title: suspended ? "User suspended" : "User unsuspended",
        description: suspended ? "User has been suspended" : "User has been unsuspended",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user suspension status",
        variant: "destructive",
      });
    },
  });

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'host':
        return <Badge className="bg-purple-100 text-purple-800">Host</Badge>;
      case 'both':
        return <Badge className="bg-blue-100 text-blue-800">Host & Attendee</Badge>;
      default:
        return <Badge variant="secondary">Attendee</Badge>;
    }
  };

  const handleRejectHost = (userId: string) => {
    verifyHostMutation.mutate({ userId, verified: false });
    setRejectingUserId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600">Manage hosts and users on the platform</p>
      </div>

      <Tabs defaultValue="hosts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hosts">Pending Hosts ({pendingHosts?.length || 0})</TabsTrigger>
          <TabsTrigger value="users">All Users ({allUsers?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="hosts">
          <Card>
            <CardHeader>
              <CardTitle>Hosts Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingHosts ? (
                <div>Loading pending hosts...</div>
              ) : pendingHosts?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No hosts pending verification
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Bio</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingHosts?.map((host) => (
                        <TableRow key={host.id}>
                          <TableCell className="font-medium">{host.full_name || 'No name'}</TableCell>
                          <TableCell>{getUserTypeBadge(host.user_type || 'attendee')}</TableCell>
                          <TableCell className="max-w-xs truncate">{host.bio || 'No bio'}</TableCell>
                          <TableCell>
                            {host.created_at ? new Date(host.created_at).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => verifyHostMutation.mutate({ userId: host.id, verified: true })}
                                disabled={verifyHostMutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <AlertDialog 
                                open={rejectingUserId === host.id} 
                                onOpenChange={(open) => setRejectingUserId(open ? host.id : null)}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={verifyHostMutation.isPending}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Host Application</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject {host.full_name || 'this user'}'s host application? 
                                      This action will prevent them from creating events.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRejectHost(host.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
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

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div>Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name || 'No name'}</TableCell>
                          <TableCell>{getUserTypeBadge(user.user_type || 'attendee')}</TableCell>
                          <TableCell>
                            {user.verified ? (
                              <Badge className="bg-green-100 text-green-800">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Unverified</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.suspended ? (
                              <Badge variant="destructive">Suspended</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                              {user.role || 'user'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {user.role !== 'admin' && (
                                <Button
                                  size="sm"
                                  variant={user.suspended ? "outline" : "destructive"}
                                  onClick={() => suspendUserMutation.mutate({ 
                                    userId: user.id, 
                                    suspended: !user.suspended 
                                  })}
                                  disabled={suspendUserMutation.isPending}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
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

export default AdminUsers;
