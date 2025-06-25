import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardList } from '@/components/dashboard/list'
import Loading from '@/components/dashboard/loading'
import { DashboardMarkers } from '@/components/dashboard/marker'
import { Footer } from '@/components/layout/footer'
import { Suspense } from 'react'

export default function DashboardPage() {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <DashboardHeader />
            <Suspense fallback={<Loading />}>
                <DashboardList />
            </Suspense>
            <DashboardMarkers />
            <Footer />
        </div>
    )
}