
'use client';

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { productListings } from "@/lib/mock-data";

const bannerItems = [
    { id: 1, imageUrl: 'https://placehold.co/1200x400.png', dataAiHint: 'fashion sale', alt: 'Fashion Sale Banner' },
    { id: 2, imageUrl: 'https://placehold.co/1200x400.png', dataAiHint: 'new arrivals', alt: 'New Arrivals Banner' },
    { id: 3, imageUrl: 'https://placehold.co/1200x400.png', dataAiHint: 'seasonal collection', alt: 'Seasonal Collection Banner' },
]

const categories = [
    { name: 'Shirts', imageUrl: 'https://placehold.co/200x200.png', dataAiHint: 'shirt' },
    { name: 'Jeans', imageUrl: 'https://placehold.co/200x200.png', dataAiHint: 'jeans' },
    { name: 'Chinos', imageUrl: 'https://placehold.co/200x200.png', dataAiHint: 'chinos' },
    { name: 'T-Shirts', imageUrl: 'https://placehold.co/200x200.png', dataAiHint: 't-shirt' },
    { name: 'Joggers', imageUrl: 'https://placehold.co/200x200.png', dataAiHint: 'joggers' },
    { name: 'Trousers', imageUrl: 'https://placehold.co/200x200.png', dataAiHint: 'trousers' },
];

export default function ExplorePage() {
  const items = productListings;

  return (
    <div className="flex flex-col">
        <section className="py-6 md:py-8 animate-in fade-in duration-500">
            <div className="container">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {bannerItems.map((item) => (
                            <CarouselItem key={item.id}>
                                <div className="aspect-[3/1] relative rounded-lg overflow-hidden">
                                    <Image src={item.imageUrl} alt={item.alt} data-ai-hint={item.dataAiHint} fill className="object-cover" />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </Carousel>
            </div>
        </section>

        <section id="categories" className="py-4 md:py-6">
            <div className="container">
                <h2 className="text-xl md:text-2xl font-headline font-bold text-center mb-4 text-primary">
                    Browse by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {categories.map((category) => (
                        <Link href={`/category/${category.name.toLowerCase()}`} key={category.name}>
                          <Card className="group flex flex-col items-center justify-center p-2 text-center transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer h-full">
                              <div className="aspect-square relative w-20 h-20 rounded-md overflow-hidden mb-2">
                                  <Image src={category.imageUrl} alt={category.name} data-ai-hint={category.dataAiHint} fill className="object-cover transition-transform group-hover:scale-105" />
                              </div>
                              <h3 className="font-headline text-sm font-semibold">{category.name}</h3>
                          </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        <section id="top-swaps" className="py-12 bg-primary/5">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-8 text-primary">
              Top Swaps
            </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="aspect-video relative">
                        <Image src={item.imageUrl || 'https://placehold.co/600x400.png'} alt={item.name} data-ai-hint="fashion item" fill className="object-cover" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col">
                        <CardTitle className="font-headline text-lg mb-1">{item.name}</CardTitle>
                        <CardDescription className="font-body text-sm mb-4 flex-grow">{item.description}</CardDescription>
                         <div className="flex flex-wrap gap-2">
                            {item.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                         <Button asChild className="w-full">
                           <Link href={`/item/${item.id}`}>View Item</Link>
                         </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </section>
    </div>
  );
}
