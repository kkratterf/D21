'use client';

import { deleteStartup } from '@/actions/startup';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@d21/design-system/components/ui/alert-dialog';
import { DropdownMenuItem } from '@d21/design-system/components/ui/dropdown-menu';
import { toast } from '@d21/design-system/components/ui/toast';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface DeleteStartupButtonProps {
    startupId: string;
    startupName: string;
}

export function DeleteStartupButton({ startupId, startupName }: DeleteStartupButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        // Close the dialog immediately
        setIsOpen(false);

        startTransition(async () => {
            const result = await deleteStartup(startupId);
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
                    <AlertDialogTitle>Delete Startup</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the startup "{startupName}"?
                        This action cannot be undone.
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