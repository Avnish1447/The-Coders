
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createListing } from "@/ai/flows/create-listing-flow";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  category: z.enum(["Shirts", "Pants", "Jackets", "Accessories"], { required_error: "Category is required" }),
  size: z.enum(["XS", "S", "M", "L", "XL", "Free Size"], { required_error: "Size is required" }),
  gender: z.enum(["Men", "Women", "Unisex"], { required_error: "Gender is required" }),
  condition: z.enum(["Like New", "Good", "Fair", "Needs Repair"], { required_error: "Condition is required" }),
  brand: z.string().max(50, "Brand must be 50 characters or less").optional(),
  tags: z.string().optional(),
  price: z.string().min(1, { message: "Price is required." }).pipe(z.coerce.number().min(0, "Price must be a positive number.")),
  images: z
    .custom<FileList>()
    .refine((files) => files && files.length >= 1, "At least one image is required.")
    .refine((files) => files && files.length <= 5, "You can upload a maximum of 5 images.")
    .refine((files) => files && Array.from(files).every((file) => file.size <= MAX_FILE_SIZE), `Each file size should be less than 5MB.`)
    .refine((files) => files && Array.from(files).every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Only .jpg, .jpeg, .png and .webp formats are supported."),
});


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export function AddListingForm() {
  const { toast } = useToast();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      tags: "",
      price: "" as any,
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
      form.setValue('images', files, { shouldValidate: true });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
        const imagePromises = Array.from(values.images).map(fileToDataURI);
        const imageURIs = await Promise.all(imagePromises);

        const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        await createListing({
            ...values,
            price: Number(values.price),
            tags: tagsArray,
            images: imageURIs,
        });

        toast({
          title: "Listing Created!",
          description: "Your item has been submitted for approval. It will appear on your dashboard once approved.",
        });
        form.reset();
        setImagePreviews([]);

    } catch (error) {
        console.error("Failed to create listing:", error);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "There was a problem creating your listing. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vintage Denim Jacket" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the item's condition, material, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormDescription>Upload up to 5 images of your item.</FormDescription>
              <FormControl>
                <Input type="file" accept="image/*" multiple onChange={handleImageChange} className="pt-2 h-auto"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative aspect-square">
                 <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="Shirts">Shirts</SelectItem>
                    <SelectItem value="Pants">Pants</SelectItem>
                    <SelectItem value="Jackets">Jackets</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="Free Size">Free Size</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select the item's condition" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                        <SelectItem value="Unisex">Unisex</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Brand (Optional)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Levi's" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="Enter a price for the item" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., vintage, winter, cotton" {...field} />
              </FormControl>
              <FormDescription>
                Add up to 5 tags, separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Create Listing"}
        </Button>
      </form>
    </Form>
  );
}
