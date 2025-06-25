'use client'

import { signInWithGoogle } from '@/lib/supabase/actions';
import { useRouter } from 'next/navigation';
import Balancer from 'react-wrap-balancer';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@d21/design-system/components/ui/button';

interface BannerProps {
    hasDirectory: boolean;
    isLoggedIn: boolean;
    className?: string;
}

export const Banner = ({ hasDirectory, isLoggedIn, className }: BannerProps) => {
    const router = useRouter();
    const supabase = createClient();

    const handleAction = async () => {
        if (!isLoggedIn) {
            await signInWithGoogle();
            return;
        }

        if (!hasDirectory) {
            router.push('/create');
            return;
        }

        router.push('/create');
    };

    const getContent = () => {
        if (!isLoggedIn) {
            return {
                title: "Build your own startup universe",
                description: "Collect your favorite startups, organize them into neat directories, and share them with the world. Just sign up to start.",
                buttonText: "Start your directory"
            };
        }

        if (!hasDirectory) {
            return {
                title: "Your first directory is waiting",
                description: "Got a list of cool startups in mind? Start your first collection and make it shine.",
                buttonText: "Create your first directory"
            };
        }

        return {
            title: "Got another idea in mind?",
            description: "Start a new directory to organize more startups — by theme, industry, or just vibes.",
            buttonText: "Start a new directory"
        };
    };

    const content = getContent();

    return (
        <div className="relative flex flex-col overflow-hidden">
            <div className='relative z-30 flex h-6 flex-row border-border border-b bg-background'>
                <div className='absolute top-0 left-0 h-6 w-full bg-gradient-to-t from-white/0 to-white/100 dark:from-[#1B1D21]/0 dark:to-[#1B1D21]/100' />
                <div className='w-4 border-border border-r' />
                <div className="w-full" />
                <div className='w-4 border-border border-l' />
            </div>
            <div className='z-30 flex w-full flex-row'>
                <div className='absolute top-0 left-0 z-40 h-full w-4 bg-gradient-to-l from-white/0 to-white/100 dark:from-[#1B1D21]/0 dark:to-[#1B1D21]/100' />
                <div className='h-full w-[15px]' />
                <div className='flex w-full flex-col gap-6 border-border border-x p-6'>
                    <div className="flex flex-col gap-4">
                        <h2 className="font-brand text-heading-subsection">
                            <Balancer>
                                {content.title}
                            </Balancer>
                        </h2>
                        <p className='text-base text-description'>
                            <Balancer>
                                {content.description}
                            </Balancer>
                        </p>
                    </div>
                    <Button className="w-fit" onClick={handleAction}>
                        {content.buttonText}
                    </Button>
                </div>
                <div className='w-[15px]' />
                <div className='absolute top-0 right-0 z-40 h-full w-4 bg-gradient-to-r from-white/0 to-white/100 dark:from-[#1B1D21]/0 dark:to-[#1B1D21]/100' />
            </div>
            <div className='relative z-30 flex h-6 flex-row border-border border-t bg-background'>
                <div className='absolute bottom-0 left-0 h-6 w-full bg-gradient-to-b from-white/0 to-white/100 dark:from-[#1B1D21]/0 dark:to-[#1B1D21]/100' />
                <div className='w-4 border-border border-r' />
                <div className='w-full' />
                <div className='w-4 border-border border-l' />
            </div>
            <div className='absolute right-2 bottom-0 z-20'>
                <svg
                    width="316"
                    height="248"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Pictogram"
                    role="img"
                    className="stroke-border"
                >
                    <path d="M13.3906 4.00098C14.1039 4.01275 14.8248 4.16709 15.4785 4.54785L18.8457 6.50293L18.8545 6.50781C19.1708 6.69406 19.5144 6.95914 19.7881 7.34473L19.8867 7.49219C20.106 7.84675 20.2492 8.27255 20.251 8.74805V8.82227L24.5947 11.3457L24.625 11.3633C25.2673 11.7455 25.9929 12.4658 26 13.5986V13.6133C26 13.6348 25.9995 13.6565 25.999 13.6777C25.9995 13.694 26 13.7102 26 13.7266V17.4404C25.9999 18.5678 25.2875 19.2949 24.6357 19.6836L24.6045 19.7012L18.1396 23.457L17.8906 23.5898C17.3034 23.8745 16.6718 23.992 16.0469 24H15.9717C15.2358 23.9973 14.4885 23.8453 13.8135 23.4521L3.40527 17.4072L3.16211 17.251C2.59152 16.85 2.02705 16.1844 2.00098 15.208L2 15.1543V11.4258L2.00098 11.3809C2.00104 11.3786 2.00089 11.3763 2.00098 11.374C2.00056 11.3574 2.00011 11.34 2 11.3232L2.00781 11.1113C2.08664 10.0736 2.78482 9.40607 3.39551 9.05078L11.1533 4.54297C11.8298 4.14938 12.578 4.00005 13.3145 4H13.3213L13.3906 4.00098ZM13.3145 5.74316C12.8068 5.74322 12.375 5.84553 12.0205 6.05176L4.26172 10.5596C3.90718 10.7658 3.72962 11.017 3.73145 11.3125C3.73329 11.6061 3.91321 11.8592 4.27148 12.0674L14.6797 18.1123C14.8975 18.2386 15.1429 18.3286 15.416 18.377C15.5805 18.4083 15.7572 18.4248 15.9414 18.4268H15.9775C16.1523 18.4268 16.3178 18.415 16.4746 18.3906L16.5059 18.3857C16.7831 18.3389 17.0309 18.2534 17.251 18.1299L17.2725 18.1182L23.7383 14.3623C24.0799 14.1643 24.2568 13.9225 24.2676 13.6406L24.2686 13.6133V13.6094C24.2667 13.3232 24.0979 13.0792 23.7617 12.875L23.7285 12.8555L18.5244 9.83105L18.5195 8.75684C18.5195 8.61944 18.473 8.48554 18.3789 8.35742C18.2923 8.23549 18.1697 8.12839 18.0117 8.03125L17.9795 8.01172L14.6133 6.05664C14.2569 5.8485 13.8223 5.74502 13.3145 5.74316Z" stroke="var(--color-border-default)" strokeWidth="0.1" />
                </svg>
            </div>
        </div>

    );
};
