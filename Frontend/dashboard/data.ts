
export type ListingStatus = "Available" | "Pending Approval" | "Exchanged";

export interface UserListing {
  id: string;
  name: string;
  status: ListingStatus;
  price: string;
  imageUrl: string;
  aiHint: string;
}

export const mockListings: UserListing[] = [
  {
    id: 'item-1',
    name: 'Vintage Denim Jacket',
    status: 'Available',
    price: 'Trade',
    imageUrl: 'https://placehold.co/400x300.png',
    aiHint: 'denim jacket'
  },
  {
    id: 'item-2',
    name: 'Silk Summer Dress',
    status: 'Available',
    price: 'Free',
    imageUrl: 'https://placehold.co/400x300.png',
    aiHint: 'summer dress'
  },
  {
    id: 'item-3',
    name: 'Leather Ankle Boots',
    status: 'Exchanged',
    price: '$20',
    imageUrl: 'https://placehold.co/400x300.png',
    aiHint: 'leather boots'
  },
  {
    id: 'item-4',
    name: 'Knit Wool Sweater',
    status: 'Pending Approval',
    price: 'Trade',
    imageUrl: 'https://placehold.co/400x300.png',
    aiHint: 'wool sweater'
  },
    {
    id: 'item-5',
    name: 'Graphic Print T-Shirt',
    status: 'Available',
    price: '$15',
    imageUrl: 'https://placehold.co/400x300.png',
    aiHint: 'graphic tee'
  },
  {
    id: 'item-6',
    name: 'Tailored Linen Trousers',
    status: 'Exchanged',
    price: 'Trade',
    imageUrl: 'https://placehold.co/400x300.png',
    aiHint: 'linen pants'
  },
];
