'use client';

import { useEffect, useState } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@d21/design-system/components/ui/form';
import { Input } from '@d21/design-system/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@d21/design-system/components/ui/sheet';
import { Textarea } from '@d21/design-system/components/ui/textarea';
import { toast } from '@d21/design-system/components/ui/toast';

import { createDirectoryAction } from '@/actions/directory';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LocationSearch } from '../startups/location-search';
import { DirectoryTagInput } from './directory-tag-input';

const directoryFormSchema = z.object({
    name: z.string().min(1, 'Il nome è obbligatorio'),
    description: z.string().min(10, 'La descrizione deve essere di almeno 10 caratteri'),
    imageUrl: z.string().url('Inserisci un URL valido').optional().or(z.literal('')),
    link: z.string().url('Inserisci un URL valido').optional().or(z.literal('')),
    tags: z.array(z.string()).min(1, 'Inserisci almeno un tag'),
    location: z.string().optional().or(z.literal('')),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    slug: z.string().min(1, 'Lo slug è obbligatorio').regex(/^[a-z0-9-]+$/, 'Lo slug può contenere solo lettere minuscole, numeri e trattini'),
});

type DirectoryFormData = z.infer<typeof directoryFormSchema>;

interface CreateDirectorySheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

// Genera automaticamente lo slug dal nome
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

    // Aggiorna lo slug quando cambia il nome
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
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
            if (data.link) formData.append('link', data.link);
            formData.append('tags', data.tags.join(','));
            if (data.location) formData.append('location', data.location);
            if (data.latitude) formData.append('latitude', data.latitude.toString());
            if (data.longitude) formData.append('longitude', data.longitude.toString());
            formData.append('slug', data.slug);

            await createDirectoryAction(formData);

            toast('Directory creata con successo!', {
                description: 'La tua nuova directory è stata creata.',
            });
            form.reset();
            onOpenChange(false);
        } catch (error) {
            toast('Errore durante la creazione', {
                description: 'Si è verificato un errore durante la creazione della directory.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader className="space-y-3">
                    <SheetTitle className="text-left">Crea Nuova Directory</SheetTitle>
                    <p className="text-muted-foreground text-sm">
                        Compila il form per creare una nuova directory di startup.
                    </p>
                </SheetHeader>

                <div className="mt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome Directory *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome della directory" {...field} />
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
                                        <FormLabel>Descrizione *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descrivi la tua directory in dettaglio"
                                                {...field}
                                            />
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
                                        <FormLabel>Slug *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="nome-directory" {...field} />
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
                                        <FormLabel>Immagine URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/image.png" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <DirectoryTagInput form={form} />

                            <LocationSearch form={form} />

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1"
                                >
                                    Annulla
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Creando...' : 'Crea Directory'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
} 