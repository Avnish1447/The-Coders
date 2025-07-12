
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, CheckCircle, Clock } from "lucide-react";
import type { UserListing } from "./data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ListingCardProps {
  listing: UserListing;
  onUpdate: (listing: UserListing) => void;
}

const statusConfig = {
    Available: {
        label: "Available",
        color: "bg-green-500 hover:bg-green-600",
        icon: CheckCircle
    },
    "Pending Approval": {
        label: "Pending",
        color: "bg-yellow-500 hover:bg-yellow-600",
        icon: Clock
    },
    Exchanged: {
        label: "Exchanged",
        color: "bg-blue-500 hover:bg-blue-600",
        icon: CheckCircle,
    }
}

export function ListingCard({ listing, onUpdate }: ListingCardProps) {
  const { toast } = useToast();
  
  const handleMarkAsExchanged = () => {
    if (listing.status !== 'Exchanged') {
        onUpdate({ ...listing, status: 'Exchanged' });
        toast({
            title: "Listing Updated",
            description: `"${listing.name}" has been marked as exchanged.`,
        });
    }
  };
  
  const handleEdit = () => {
      toast({
            title: "Edit Listing",
            description: "This feature would open an edit form.",
            variant: "default"
      })
  }
  
  const currentStatus = statusConfig[listing.status];

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <Image
          src={listing.imageUrl}
          width={400}
          height={300}
          alt={listing.name}
          data-ai-hint={listing.aiHint}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className={cn("absolute top-2 left-2 text-white", currentStatus.color)}>
            <currentStatus.icon className="h-3 w-3 mr-1" />
            {currentStatus.label}
        </Badge>
         <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/75 border-none text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit listing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAsExchanged} disabled={listing.status === 'Exchanged'}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Mark as Exchanged</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{listing.name}</h3>
        <p className="text-sm text-muted-foreground">{listing.price}</p>
      </CardContent>
    </Card>
  );
}
