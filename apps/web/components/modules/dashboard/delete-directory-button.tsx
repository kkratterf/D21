'use client';

import { deleteDirectory } from '@/actions/directory';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@d21/design-system/components/ui/alert-dialog';
import { DropdownMenuItem } from '@d21/design-system/components/ui/dropdown-menu';
import { toast } from '@d21/design-system/components/ui/toast';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface DeleteDirectoryButtonProps {
    directoryId: string;
    directoryName: string;
}

export function DeleteDirectoryButton({ directoryId, directoryName }: DeleteDirectoryButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        // Close the dialog immediately
        setIsOpen(false);

        startTransition(async () => {
            const result = await deleteDirectory(directoryId);
            if (result.success) {
                toast(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                >
                    Delete
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Directory</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the directory "{directoryName}"?
                        This action will also delete all startups contained and cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 