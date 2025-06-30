'use client';

import { useEffect, useState } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@d21/design-system/components/ui/form';
import { Input } from '@d21/design-system/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@d21/design-system/components/ui/select';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@d21/design-system/components/ui/sheet';
import { Textarea } from '@d21/design-system/components/ui/textarea';
import { toast } from '@d21/design-system/components/ui/toast';

import { getFundingStages } from '@/actions/fundingStage';
import { updateStartupAction } from '@/actions/startup';
import { getTeamSizes } from '@/actions/teamSize';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Separator } from '@d21/design-system/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { LocationSearch } from './location-search';
import { TagInput } from './tag-input';

const startupFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
    longDescription: z.string().min(10, 'Long description must be at least 10 characters'),
    websiteUrl: z.string().url('Please enter a valid URL'),
    logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    foundedAt: z.string().min(1, 'Founded date is required'),
    location: z.string().min(1, 'Location is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    teamSizeId: z.string().min(1, 'Please select team size'),
    fundingStageId: z.string().min(1, 'Please select funding stage'),
    contactEmail: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Please enter a valid URL').min(1, 'LinkedIn URL is required'),
    tags: z.array(z.string()).min(1, 'Please enter at least one tag'),
    amountRaised: z.string().optional().or(z.literal('')),
    currency: z.string().optional().or(z.literal('')),
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
        websiteUrl?: string | null;
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
        currency?: string | null;
    };
}

export function EditStartupSheet({ isOpen, onOpenChange, directorySlug, startup }: EditStartupSheetProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessingLogo, setIsProcessingLogo] = useState(false);
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
            currency: startup.currency || '',
        },
    });

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
            currency: startup.currency || '',
        });

        // Trigger validation after reset
        setTimeout(() => {
            form.trigger();
        }, 100);
    }, [startup, form]);

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
                toast.error('Error loading data', {
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const onSubmit = async (data: StartupFormData) => {
        setIsSubmitting(true);
        setIsProcessingLogo(false);

        try {
            const formData = new FormData();
            formData.append('startupId', startup.id);
            formData.append('directoryId', directorySlug);
            formData.append('name', data.name);
            formData.append('shortDescription', data.shortDescription);
            if (data.longDescription) formData.append('longDescription', data.longDescription);
            formData.append('websiteUrl', data.websiteUrl);
            if (data.logoUrl) {
                formData.append('logoUrl', data.logoUrl);
                // Only process if it's not already a Postimages.org URL
                if (!data.logoUrl.includes('postimg.cc') && !data.logoUrl.includes('postimages.org')) {
                    setIsProcessingLogo(true);
                }
            }
            if (data.foundedAt) formData.append('foundedAt', data.foundedAt);
            formData.append('location', data.location);
            if (data.latitude) formData.append('latitude', data.latitude.toString());
            if (data.longitude) formData.append('longitude', data.longitude.toString());
            formData.append('teamSizeId', data.teamSizeId);
            formData.append('fundingStageId', data.fundingStageId);
            if (data.contactEmail) formData.append('contactEmail', data.contactEmail);
            formData.append('linkedinUrl', data.linkedinUrl);
            formData.append('tags', data.tags.join(','));
            if (data.amountRaised) formData.append('amountRaised', data.amountRaised);
            if (data.currency) formData.append('currency', data.currency);

            await updateStartupAction(formData);

            toast('🎉 Startup updated successfully');
            onOpenChange(false);
        } catch (error) {
            toast.error('Error updating startup');
        } finally {
            setIsSubmitting(false);
            setIsProcessingLogo(false);
        }
    };

    if (isLoading) {
        return (
            <Sheet open={isOpen} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg">
                    <SheetHeader className="space-y-3">
                        <SheetTitle className="text-left">Edit startup</SheetTitle>
                    </SheetHeader>
                    <div className='flex h-80 w-full items-center justify-center'>
                        <Loader2 className='size-4 animate-spin stroke-icon' />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <SheetHeader className="space-y-3">
                            <SheetTitle className="text-left">Edit startup</SheetTitle>
                        </SheetHeader>
                        <div className='space-y-5 py-6'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Acme Inc." {...field} />
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
                                        <FormLabel>Short Description <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Your startup in a nutshell..."
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
                                        <FormLabel>Long Description <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Now tell us the real story..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <TagInput form={form} directoryId={directorySlug} />
                            <Separator />
                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://acme.com" {...field} />
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
                                        <FormLabel>LinkedIn URL <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://linkedin.com/company/acme" {...field} />
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
                                        <p className="text-muted-foreground text-sm">
                                            💡 The image will be automatically uploaded to Postimages.org to ensure permanent availability.
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="hello@acme.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <FormField
                                control={form.control}
                                name="foundedAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Founded at <span className='text-description'>*</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <LocationSearch form={form} />
                            <Separator />

                            <FormField
                                control={form.control}
                                name="teamSizeId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Team Size <span className='text-description'>*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select team size" />
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
                                        <FormLabel>Funding Stage <span className='text-description'>*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select funding stage" />
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
                            <div className='flex w-full flex-col gap-3 sm:flex-row'>
                                <FormField
                                    control={form.control}
                                    name="amountRaised"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Amount Raised</FormLabel>
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
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem className='min-w-40'>
                                            <FormLabel>Currency</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select currency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD</SelectItem>
                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                    <SelectItem value="GBP">GBP</SelectItem>
                                                    <SelectItem value="JPY">JPY</SelectItem>
                                                    <SelectItem value="AUD">AUD</SelectItem>
                                                    <SelectItem value="CAD">CAD</SelectItem>
                                                    <SelectItem value="CHF">CHF</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
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
                                loadingText="Wait a sec..."
                                isLoading={isSubmitting}
                                onClick={async () => {
                                    // Trigger manual validation and submit if valid
                                    const isValid = await form.trigger();
                                    if (isValid) {
                                        const formData = form.getValues();
                                        await onSubmit(formData);
                                    }
                                }}
                            >
                                Edit
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
} 