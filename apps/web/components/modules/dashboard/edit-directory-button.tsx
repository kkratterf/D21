'use client';

import { DropdownMenuItem } from '@d21/design-system/components/ui/dropdown-menu';

interface EditDirectoryButtonProps {
    onEditClick: () => void;
}

export function EditDirectoryButton({ onEditClick }: EditDirectoryButtonProps) {
    return (
        <DropdownMenuItem onClick={onEditClick}>
            Edit
        </DropdownMenuItem>
    );
} 