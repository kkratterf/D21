'use client';

import { toggleStartupVisibility } from '@/actions/startup';
import { Switch } from '@d21/design-system/components/ui/switch';
import { toast } from '@d21/design-system/components/ui/toast';
import { Tooltip } from '@d21/design-system/components/ui/tooltip';
import { useState, useTransition } from 'react';

interface StartupVisibilitySwitchProps {
    startupId: string;
    isVisible: boolean;
}

export function StartupVisibilitySwitch({ startupId, isVisible }: StartupVisibilitySwitchProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticVisible, setOptimisticVisible] = useState(isVisible);

    const handleToggle = () => {
        // Aggiorna immediatamente l'UI
        setOptimisticVisible(!optimisticVisible);

        startTransition(async () => {
            const result = await toggleStartupVisibility(startupId);
            if (result.success && result.visible !== undefined) {
                toast(result.message);
            } else {
                // Se l'operazione fallisce, ripristina lo stato precedente
                setOptimisticVisible(isVisible);
                toast.error(result.message);
            }
        });
    };

    return (
        <Tooltip content={optimisticVisible ? 'Hide startup' : 'Show startup'}>
            <div className='h-5'>
                <Switch
                    checked={optimisticVisible}
                    className='rounded-full'
                    onCheckedChange={handleToggle}
                    aria-label={`Make startup ${optimisticVisible ? 'invisible' : 'visible'}`}
                />
            </div>
        </Tooltip>
    );
} 