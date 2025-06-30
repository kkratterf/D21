'use client';

import { useEffect, useState } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@d21/design-system/components/ui/form';
import { Input } from '@d21/design-system/components/ui/input';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@d21/design-system/components/ui/sheet';
import { Textarea } from '@d21/design-system/components/ui/textarea';
import { toast } from '@d21/design-system/components/ui/toast';

import { createDirectoryAction } from '@/actions/directory';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Separator } from '@d21/design-system/components/ui/separator';
import { LocationSearch } from '../startups/location-search';
import { DirectoryTagInput } from './directory-tag-input';

const directoryFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    tags: z.array(z.string()).min(1, 'Please enter at least one tag'),
    location: z.string().optional().or(z.literal('')),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
});

type DirectoryFormData = z.infer<typeof directoryFormSchema>;

interface CreateDirectorySheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

// Generate slug automatically from name
const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

export function CreateDirectorySheet({ isOpen, onOpenChange }: CreateDirectorySheetProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);

    const form = useForm<DirectoryFormData>({
        resolver: zodResolver(directoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
            link: '',
            tags: [],
            location: '',
            latitude: 0,
            longitude: 0,
            slug: '',
        },
    });

    // Update slug when name changes
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'name' && value.name) {
                const generatedSlug = generateSlug(value.name);
                form.setValue('slug', generatedSlug);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = async (data: DirectoryFormData) => {
        setIsSubmitting(true);
        setIsProcessingImage(false);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            if (data.imageUrl) {
                formData.append('imageUrl', data.imageUrl);
                setIsProcessingImage(true);
            }
            if (data.link) formData.append('link', data.link);
            formData.append('tags', data.tags.join(','));
            if (data.location) formData.append('location', data.location);
            if (data.latitude) formData.append('latitude', data.latitude.toString());
            if (data.longitude) formData.append('longitude', data.longitude.toString());
            formData.append('slug', data.slug);

            await createDirectoryAction(formData);

            toast('🎉 Directory created successfully!');
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast.error('Error creating directory');
        } finally {
            setIsSubmitting(false);
            setIsProcessingImage(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <SheetHeader className="space-y-3">
                            <SheetTitle className="text-left">Create directory</SheetTitle>
                        </SheetHeader>
                        <div className='space-y-5 py-6'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Directory name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="directory-name" {...field} />
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
                                        <FormLabel>Description <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your directory in detail"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DirectoryTagInput form={form} />
                            <LocationSearch form={form} />
                            <Separator />

                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.png" {...field} />
                                        </FormControl>
                                        <p className="text-muted-foreground text-sm">
                                            💡 The image will be automatically uploaded to Postimages.org to ensure permanent availability.
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />




                        </div>
                        <SheetFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loadingText='Wait a sec...'
                                isLoading={isSubmitting}
                            >
                                Create
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
} 