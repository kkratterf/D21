'use client';

import { useEffect, useState } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@d21/design-system/components/ui/form';
import { Input } from '@d21/design-system/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@d21/design-system/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@d21/design-system/components/ui/sheet';
import { Textarea } from '@d21/design-system/components/ui/textarea';
import { toast } from '@d21/design-system/components/ui/toast';

import { getFundingStages } from '@/actions/fundingStage';
import { updateStartupAction } from '@/actions/startup';
import { getTeamSizes } from '@/actions/teamSize';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LocationSearch } from './location-search';
import { TagInput } from './tag-input';

const startupFormSchema = z.object({
    name: z.string().min(1, 'Il nome è obbligatorio'),
    shortDescription: z.string().min(10, 'La descrizione breve deve essere di almeno 10 caratteri'),
    longDescription: z.string().optional().or(z.literal('')),
    websiteUrl: z.string().url('Inserisci un URL valido'),
    logoUrl: z.string().url('Inserisci un URL valido').optional().or(z.literal('')),
    foundedAt: z.string().optional(),
    location: z.string().min(1, 'La location è obbligatoria'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    teamSizeId: z.string().min(1, 'Seleziona la dimensione del team'),
    fundingStageId: z.string().min(1, 'Seleziona lo stage di funding'),
    contactEmail: z.string().email('Inserisci un email valida').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Inserisci un URL valido').optional().or(z.literal('')),
    tags: z.array(z.string()).min(1, 'Inserisci almeno un tag'),
    amountRaised: z.string().optional().or(z.literal('')),
});

type StartupFormData = z.infer<typeof startupFormSchema>;

interface EditStartupSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    directorySlug: string;
    startup: {
        id: string;
        name: string;
        shortDescription: string;
        longDescription?: string | null;
        websiteUrl: string | null;
        logoUrl?: string | null;
        foundedAt?: Date | null;
        location: string;
        latitude?: number | null;
        longitude?: number | null;
        teamSizeId: string;
        fundingStageId: string;
        contactEmail?: string | null;
        linkedinUrl?: string | null;
        tags: string[];
        amountRaised?: number | null;
    };
}

export function EditStartupSheet({ isOpen, onOpenChange, directorySlug, startup }: EditStartupSheetProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teamSizes, setTeamSizes] = useState<Array<{ id: string; name: string; minSize: number; maxSize: number | null }>>([]);
    const [fundingStages, setFundingStages] = useState<Array<{ id: string; name: string; order: number }>>([]);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<StartupFormData>({
        resolver: zodResolver(startupFormSchema),
        defaultValues: {
            name: startup.name,
            shortDescription: startup.shortDescription,
            longDescription: startup.longDescription || '',
            websiteUrl: startup.websiteUrl || '',
            logoUrl: startup.logoUrl || '',
            foundedAt: startup.foundedAt ? startup.foundedAt.toISOString().split('T')[0] : '',
            location: startup.location,
            latitude: startup.latitude || 0,
            longitude: startup.longitude || 0,
            teamSizeId: startup.teamSizeId,
            fundingStageId: startup.fundingStageId,
            contactEmail: startup.contactEmail || '',
            linkedinUrl: startup.linkedinUrl || '',
            tags: startup.tags,
            amountRaised: startup.amountRaised?.toString() || '',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamSizesData, fundingStagesData] = await Promise.all([
                    getTeamSizes(),
                    getFundingStages()
                ]);
                setTeamSizes(teamSizesData);
                setFundingStages(fundingStagesData);
            } catch (error) {
                toast('Errore nel caricamento dei dati', {
                    description: 'Errore nel caricamento dei dati. Riprova.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    // Reset form when startup changes
    useEffect(() => {
        form.reset({
            name: startup.name,
            shortDescription: startup.shortDescription,
            longDescription: startup.longDescription || '',
            websiteUrl: startup.websiteUrl || '',
            logoUrl: startup.logoUrl || '',
            foundedAt: startup.foundedAt ? startup.foundedAt.toISOString().split('T')[0] : '',
            location: startup.location,
            latitude: startup.latitude || 0,
            longitude: startup.longitude || 0,
            teamSizeId: startup.teamSizeId,
            fundingStageId: startup.fundingStageId,
            contactEmail: startup.contactEmail || '',
            linkedinUrl: startup.linkedinUrl || '',
            tags: startup.tags,
            amountRaised: startup.amountRaised?.toString() || '',
        });
    }, [startup, form]);

    const onSubmit = async (data: StartupFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('startupId', startup.id);
            formData.append('directoryId', directorySlug);
            formData.append('name', data.name);
            formData.append('shortDescription', data.shortDescription);
            if (data.longDescription) formData.append('longDescription', data.longDescription);
            formData.append('websiteUrl', data.websiteUrl);
            if (data.logoUrl) formData.append('logoUrl', data.logoUrl);
            if (data.foundedAt) formData.append('foundedAt', data.foundedAt);
            formData.append('location', data.location);
            if (data.latitude) formData.append('latitude', data.latitude.toString());
            if (data.longitude) formData.append('longitude', data.longitude.toString());
            formData.append('teamSizeId', data.teamSizeId);
            formData.append('fundingStageId', data.fundingStageId);
            if (data.contactEmail) formData.append('contactEmail', data.contactEmail);
            if (data.linkedinUrl) formData.append('linkedinUrl', data.linkedinUrl);
            formData.append('tags', data.tags.join(','));
            if (data.amountRaised) formData.append('amountRaised', data.amountRaised);

            await updateStartupAction(formData);

            toast('Startup aggiornata con successo!', {
                description: 'Le modifiche sono state salvate.',
            });
            onOpenChange(false);
        } catch (error) {
            toast('Errore durante l\'aggiornamento', {
                description: 'Errore durante l\'aggiornamento della startup. Riprova.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader className="space-y-3">
                        <SheetTitle className="text-left">Modifica Startup</SheetTitle>
                        <p className="text-muted-foreground text-sm">
                            Caricamento...
                        </p>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader className="space-y-3">
                    <SheetTitle className="text-left">Modifica Startup</SheetTitle>
                    <p className="text-muted-foreground text-sm">
                        Modifica i dati della startup "{startup.name}".
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
                                        <FormLabel>Nome Startup *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome della startup" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="shortDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrizione Breve *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descrivi la tua startup in dettaglio"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="longDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrizione Estesa</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descrivi la tua startup in dettaglio"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="logoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Logo URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/logo.png" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name="foundedAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data di fondazione</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <LocationSearch form={form} />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name="teamSizeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dimensione Team *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleziona" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {teamSizes.map((teamSize) => (
                                                        <SelectItem key={teamSize.id} value={teamSize.id}>
                                                            {teamSize.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fundingStageId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Funding Stage *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleziona" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {fundingStages.map((fundingStage) => (
                                                        <SelectItem key={fundingStage.id} value={fundingStage.id}>
                                                            {fundingStage.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email di contatto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="contact@startup.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="linkedinUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LinkedIn URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://linkedin.com/company/startup" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <TagInput form={form} directoryId={directorySlug} />

                            <FormField
                                control={form.control}
                                name="amountRaised"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount Raised (USD)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="1000000"
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                    {isSubmitting ? 'Salvando...' : 'Salva Modifiche'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
} 