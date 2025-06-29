'use client';

import { DropdownMenuItem } from '@d21/design-system/components/ui/dropdown-menu';

interface EditStartupButtonProps {
    onEditClick: () => void;
}

export function EditStartupButton({ onEditClick }: EditStartupButtonProps) {
    return (
        <DropdownMenuItem onClick={onEditClick}>
            Edit
        </DropdownMenuItem>
    );
} 