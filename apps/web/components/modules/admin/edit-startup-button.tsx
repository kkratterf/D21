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
            >
                <Edit />
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