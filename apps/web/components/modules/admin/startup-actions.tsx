'use client';

import { approveStartup, rejectStartup } from '@/actions/startup';
import { Button } from '@d21/design-system/components/ui/button';
import { toast } from '@d21/design-system/components/ui/toast';
import { Check, X } from 'lucide-react';
import { useTransition } from 'react';

interface StartupActionsProps {
    startupId: string;
}

export function StartupActions({ startupId }: StartupActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const result = await approveStartup(startupId);
            if (result.success) {
                toast.success(result.message);
                // Ricarica la pagina per aggiornare i dati
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        });
    };

    const handleReject = () => {
        if (!confirm('Sei sicuro di voler rifiutare questa startup? Questa azione non può essere annullata.')) {
            return;
        }

        startTransition(async () => {
            const result = await rejectStartup(startupId);
            if (result.success) {
                toast.success(result.message);
                // Ricarica la pagina per aggiornare i dati
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={handleApprove}
                disabled={isPending}
                variant="primary"
                size="small"
                className="flex items-center gap-1"
            >
                <Check className='h-3 w-3' />
                Approva
            </Button>
            <Button
                onClick={handleReject}
                disabled={isPending}
                variant="danger"
                size="small"
                className="flex items-center gap-1"
            >
                <X className='h-3 w-3' />
                Rifiuta
            </Button>
        </div>
    );
} 