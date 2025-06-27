'use client';

import { useState } from 'react';

import { Button } from '@d21/design-system/components/ui/button';
import { Edit } from 'lucide-react';

import { EditDirectorySheet } from './edit-directory-sheet';

interface EditDirectoryButtonProps {
    directory: {
        id: string;
        name: string;
        description: string | null;
        imageUrl: string | null;
        link: string | null;
        tags: string[];
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        slug: string;
    };
}

export function EditDirectoryButton({ directory }: EditDirectoryButtonProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <>
            <Button
                variant="secondary"
                size="small"
                onClick={() => setIsEditOpen(true)}
                className='h-8 w-8 p-0'
            >
                <Edit className='h-3 w-3' />
            </Button>
            <EditDirectorySheet
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                directory={directory}
            />
        </>
    );
} 