'use client';

import { toggleDirectoryVisibility } from '@/actions/directory';
import { Switch } from '@d21/design-system/components/ui/switch';
import { toast } from '@d21/design-system/components/ui/toast';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { useState, useTransition } from 'react';

interface DirectoryVisibilitySwitchProps {
    directoryId: string;
    isVisible: boolean;
}

export function DirectoryVisibilitySwitch({ directoryId, isVisible }: DirectoryVisibilitySwitchProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticVisible, setOptimisticVisible] = useState(isVisible);

    const handleToggle = () => {
        // Update the UI immediately    
        setOptimisticVisible(!optimisticVisible);

        startTransition(async () => {
            const result = await toggleDirectoryVisibility(directoryId);
            if (result.success && result.visible !== undefined) {
                toast(result.message);
            } else {
                // If the operation fails, restore the previous state
                setOptimisticVisible(isVisible);
                toast.error(result.message);
            }
        });
    };

    return (
        <Tooltip content={optimisticVisible ? 'Hide directory' : 'Show directory'}>
            <div className='h-5'>
                <Switch
                    checked={optimisticVisible}
                    className='rounded-full'
                    onCheckedChange={handleToggle}
                    aria-label={`Make directory ${optimisticVisible ? 'invisible' : 'visible'}`}
                />
            </div>
        </Tooltip>
    );
} 