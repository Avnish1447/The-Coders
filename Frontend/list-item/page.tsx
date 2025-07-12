
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddListingForm } from './add-listing-form';
import { Separator } from '@/components/ui/separator';

export default function AddItemPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-headline">Create a New Listing</h1>
        <p className="text-muted-foreground mt-2">
            Fill out the details below to add a new clothing item to your collection for trade or sale.
        </p>
        <Separator className="my-6" />
        <Card>
            <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                    Provide as much detail as possible to help others find your item.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AddListingForm />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
