
export interface ProductListing {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export const productListings: ProductListing[] = [
  {
    id: 'item-1',
    name: 'Vintage Denim Jacket',
    description: 'A classic denim jacket from the 90s, perfect for a retro look.',
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['Denim', 'Jacket', 'Vintage'],
  },
  {
    id: 'item-2',
    name: 'Silk Summer Dress',
    description: 'Light and airy silk dress for warm summer days.',
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['Dress', 'Silk', 'Summer'],
  },
  {
    id: 'item-3',
    name: 'Leather Ankle Boots',
    description: 'Stylish and durable leather boots for any occasion.',
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['Boots', 'Leather', 'Footwear'],
  },
  {
    id: 'item-4',
    name: 'Knit Wool Sweater',
    description: 'Cozy and warm sweater made from 100% pure wool.',
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['Sweater', 'Wool', 'Winter'],
  },
];
