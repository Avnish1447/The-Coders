
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface Item {
  id: number;
  name: string;
  description: string;
  tags: string[];
  imageUrl: string;
  dataAiHint: string;
  status: string;
}

const mockPendingItems: Item[] = [
    { id: 101, name: "Vintage Denim Jacket", description: "A classic 90s denim jacket, slightly distressed.", tags: ["denim", "jacket", "vintage"], imageUrl: "https://placehold.co/64x64.png", dataAiHint: "denim jacket", status: "pending" },
    { id: 102, name: "Hand-knitted Wool Scarf", description: "A very warm and colorful scarf, made from merino wool.", tags: ["handmade", "fashion", "accessory", "scarf"], imageUrl: "https://placehold.co/64x64.png", dataAiHint: "wool scarf", status: "pending"},
    { id: 103, name: "Floral Silk Blouse", description: "A beautiful silk blouse with a floral pattern, perfect for spring.", tags: ["silk", "blouse", "floral", "fashion"], imageUrl: "https://placehold.co/64x64.png", dataAiHint: "silk blouse", status: "pending" },
];


export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const { toast } = useToast();

  const fetchPendingItems = useCallback(async () => {
    if (!token) return;
    try {
      // MOCK API Call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setPendingItems(mockPendingItems);
    } catch (error) {
      console.error('Failed to fetch pending items:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch pending items.',
      });
    }
  }, [token, toast]);

  useEffect(() => {
    if (token === null) {
      // Still loading
      return;
    }
    if (!token || user?.role !== 'admin') {
      router.push('/login');
    } else {
        fetchPendingItems();
    }
  }, [token, user, router, fetchPendingItems]);


  const handleApprove = async (itemId: number) => {
    try {
       await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Success', description: 'Item approved.' });
      setPendingItems(currentItems => currentItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to approve item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve item.',
      });
    }
  };

  const handleReject = async (itemId: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Success', description: 'Item rejected.' });
      setPendingItems(currentItems => currentItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to reject item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject item.',
      });
    }
  };

  if (!user || user.role !== 'admin') {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <p>Loading or redirecting...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Admin Panel</h1>
        </div>
        <Tabs defaultValue="manage-listings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manage-users">Manage Users</TabsTrigger>
            <TabsTrigger value="manage-orders">Manage Orders</TabsTrigger>
            <TabsTrigger value="manage-listings">Manage Listings</TabsTrigger>
          </TabsList>
          <TabsContent value="manage-users">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage your users here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>User management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manage-orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage user orders here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Order management coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manage-listings">
            <Card>
              <CardHeader>
                <CardTitle>Pending Item Listings</CardTitle>
                <CardDescription>Review and approve or reject new item listings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItems.length > 0 ? (
                      pendingItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt={item.name}
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={item.imageUrl || 'https://placehold.co/64x64.png'}
                              data-ai-hint={item.dataAiHint}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleApprove(item.id)}>Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(item.id)}>Reject</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No pending items to review.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
