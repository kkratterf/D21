'use client'
import NavMobile from '@/components/layout/nav-mobile'
import { SubmitStartupSheet } from '@/components/modules/startups/submit-sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@d21/design-system/components/ui/avatar'
import { Button } from '@d21/design-system/components/ui/button'
import { toast } from '@d21/design-system/components/ui/toast'
import { Tooltip } from '@d21/design-system/components/ui/tooltip'
import { useIsMobile } from '@d21/design-system/hooks/useMobile'
import { Globe, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface DirectoryHeaderProps {
    slug: string
    directory?: {
        id: string
        name: string
        description?: string | null
        slug: string
        imageUrl?: string | null
    } | null
}

export function DirectoryHeader({ directory }: DirectoryHeaderProps) {
    const [isSubmitSheetOpen, setIsSubmitSheetOpen] = useState(false)
    const isMobile = useIsMobile()

    const handleShare = async () => {
        try {
            const currentUrl = window.location.href
            await navigator.clipboard.writeText(currentUrl)
            toast('📣 URL copied to clipboard! Ready to share')
        } catch (error) {
            toast.error('Failed to copy URL')
        }
    }

    if (!directory) {
        return (
            <div className='flex items-center justify-between px-7'>
                <h1 className="font-brand text-3xl">Directory not found</h1>
                <NavMobile />
            </div>
        )
    }

    return (
        <div className='flex flex-col items-start justify-between gap-4 border-border border-b px-7 pb-6 md:flex-row'>
            <div className='flex w-full flex-col items-center gap-3'>
                <div className='flex w-full items-center gap-3'>
                    {directory.imageUrl && (
                        <Avatar className='size-9 rounded-lg'>
                            <AvatarImage src={directory.imageUrl} />
                            <AvatarFallback>
                                {directory.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <h1 className="w-full font-brand text-2xl">{directory.name}</h1>
                    <NavMobile />
                </div>
                {directory.description && (
                    <p className='line-clamp-1 w-full text-description'>{directory.description}</p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Tooltip content="Share directory">
                    <Button
                        variant="secondary"
                        onClick={handleShare}
                        icon
                    >
                        <Share2 />
                    </Button>
                </Tooltip>
                <Tooltip content="Map view">
                    <Button variant="secondary" icon asChild>
                        <Link href={`/${directory.slug}/map`}>
                            <Globe />
                        </Link>
                    </Button>
                </Tooltip>
                <Button
                    variant="primary"
                    onClick={() => setIsSubmitSheetOpen(true)}
                >
                    Submit
                </Button>
            </div>
            <SubmitStartupSheet
                isOpen={isSubmitSheetOpen}
                onOpenChange={setIsSubmitSheetOpen}
                directorySlug={directory.slug}
            />
        </div>
    )
} 