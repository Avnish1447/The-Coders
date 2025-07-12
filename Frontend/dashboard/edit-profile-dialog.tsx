
"use client";

import * as React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


interface EditProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentName: string;
  onSave: (newName: string) => void;
}

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export function EditProfileDialog({ isOpen, setIsOpen, currentName, onSave }: EditProfileDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentName,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ name: currentName });
    }
  }, [isOpen, currentName, form]);

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    onSave(values.name);
    setIsOpen(false);
    toast({
      title: "Profile Updated",
      description: "Your name has been successfully changed.",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="col-span-3" />
                      </FormControl>
                      <FormMessage className="col-span-4 text-right" />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
