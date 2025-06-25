import type React from "react"

export const PartnersGrid = ({ children }: { children: React.ReactNode }) => {
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
                <div className='w-full border-border border-x'>
                    {children}
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
        </div>
    )
}