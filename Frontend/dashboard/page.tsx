
"use client";

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, BarChart3, Package, Repeat, Plus, LogOut, Shield } from "lucide-react";
import { mockListings, UserListing } from './data';
import { EditProfileDialog } from './edit-profile-dialog';
import { ListingCard } from './listing-card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const [userName, setUserName] = React.useState('Username');
  const [listings, setListings] = React.useState<UserListing[]>(mockListings);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const isAdmin = true; // Placeholder for admin role check

  const stats = React.useMemo(() => {
    const totalListed = listings.length;
    const totalReused = listings.filter(item => item.status === 'Exchanged').length;
    return { totalListed, totalReused };
  }, [listings]);
  
  const handleUpdateListing = (updatedListing: UserListing) => {
    setListings(prevListings => 
      prevListings.map(listing => 
        listing.id === updatedListing.id ? updatedListing : listing
      )
    );
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // In a real app, you'd also clear tokens and redirect.
    router.push('/');
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 font-headline">User Dashboard</h1>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="flex flex-col items-center justify-center space-y-4 col-span-1 md:border-r md:pr-6">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src="https://placehold.co/128x128.png" alt={userName} />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{userName}</h2>
                <div className="flex gap-2 flex-wrap justify-center">
                   <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    {isLoggedIn && (
                        <>
                           {isAdmin && (
                            <Button variant="secondary" size="sm" asChild>
                                <Link href="/admin">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Admin Panel
                                </Link>
                            </Button>
                           )}
                           <Button variant="destructive" size="sm" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                           </Button>
                        </>
                    )}
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items Listed</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalListed}</div>
                    <p className="text-xs text-muted-foreground">Items you've put up for reuse</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items Reused</CardTitle>
                    <Repeat className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalReused}</div>
                     <p className="text-xs text-muted-foreground">Items successfully exchanged</p>
                  </CardContent>
                </Card>
                <div className="sm:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5" />
                        Activity Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Your listing activity will be shown here.</p>
                       <div className="w-full h-24 bg-muted rounded-md mt-2 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Chart placeholder</span>
                       </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold font-headline">My Listings</h2>
              <Button asChild>
                <Link href="/list-item">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add listing</span>
                </Link>
              </Button>
            </div>
            {listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} onUpdate={handleUpdateListing} />
                ))}
              </div>
            ) : (
               <div className="text-center py-12 px-6 rounded-lg border-2 border-dashed">
                  <h3 className="text-lg font-medium">You haven't listed any items yet.</h3>
                  <p className="text-muted-foreground mt-1">Click the '+' button to list your first item!</p>
                  <Button className="mt-4" asChild>
                    <Link href="/list-item">
                        <Plus className="mr-2 h-4 w-4" />
                        List an Item
                    </Link>
                  </Button>
               </div>
            )}
          </div>
        </div>
      </div>
      <EditProfileDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        currentName={userName}
        onSave={setUserName}
      />
    </>
  );
}
