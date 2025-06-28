import { getStartupById } from '@/actions/startup';
import LeftPanel from './left-panel';
import { LeftPanelSkeleton } from './left-panel-skeleton';
import RightPanel from './right-panel';
import { RightPanelSkeleton } from './right-panel-skeleton';

interface StartupDetailWrapperProps {
    id: string;
}

export async function StartupDetailWrapper({ id }: StartupDetailWrapperProps) {
    const startup = await getStartupById(id);

    if (!startup) {
        return (
            <div className='relative flex lg:flex-row flex-col gap-4 p-6 pb-0 w-full min-h-dvh'>
                <LeftPanelSkeleton />
                <RightPanelSkeleton />
            </div>
        );
    }

    return (
        <div className='relative flex lg:flex-row flex-col gap-4 p-6 pb-0 w-full min-h-dvh'>
            <LeftPanel startup={startup} />
            <RightPanel startup={startup} />
        </div>
    );
} 