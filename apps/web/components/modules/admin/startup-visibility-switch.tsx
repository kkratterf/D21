'use client';

import { toggleStartupVisibility } from '@/actions/startup';
import { Switch } from '@d21/design-system/components/ui/switch';
import { toast } from '@d21/design-system/components/ui/toast';
import { useState, useTransition } from 'react';

interface StartupVisibilitySwitchProps {
    startupId: string;
    isVisible: boolean;
}

export function StartupVisibilitySwitch({ startupId, isVisible }: StartupVisibilitySwitchProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticVisible, setOptimisticVisible] = useState(isVisible);

    // Aggiorna lo stato quando cambia la prop
    if (optimisticVisible !== isVisible) {
        setOptimisticVisible(isVisible);
    }

    const handleToggle = () => {
        // Aggiorna immediatamente l'UI
        setOptimisticVisible(!optimisticVisible);

        startTransition(async () => {
            const result = await toggleStartupVisibility(startupId);
            if (result.success && result.visible !== undefined) {
                toast.success(result.message);
            } else {
                // Se l'operazione fallisce, ripristina lo stato precedente
                setOptimisticVisible(isVisible);
                toast.error(result.message);
            }
        });
    };

    return (
        <Switch
            checked={optimisticVisible}
            onCheckedChange={handleToggle}
            disabled={isPending}
            aria-label={`Rendi ${optimisticVisible ? 'invisibile' : 'visibile'} la startup`}
        />
    );
} 