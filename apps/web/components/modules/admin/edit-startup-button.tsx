'use client';

import { useState } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Edit } from 'lucide-react';

import { EditStartupSheet } from '../startups/edit-startup-sheet';

interface EditStartupButtonProps {
    startup: any;
    directorySlug: string;
}

export function EditStartupButton({ startup, directorySlug }: EditStartupButtonProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <>
            <Button
                variant="secondary"
                size="small"
                onClick={() => setIsEditOpen(true)}
                className='p-0 w-8 h-8'
            >
                <Edit className='w-3 h-3' />
            </Button>
            <EditStartupSheet
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                directorySlug={directorySlug}
                startup={startup}
            />
        </>
    );
} 