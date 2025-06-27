import { getUserDirectoriesWithPagination } from '@/actions/directory';
import NavMobile from '@/components/layout/nav-mobile';
import { DashboardFiltersClient } from '@/components/modules/dashboard/dashboard-filters-client';
import { DashboardPagination } from '@/components/modules/dashboard/pagination';
import ScrollToTop from '@/components/scrollToTopClient';
import DashboardCard, { DashboardCardSkeleton } from '@/components/ui/dashboard-card';
import Empty from '@/components/ui/empty';
import { parseDashboardSearchParams } from '@/lib/utils';
import { DIRECTORY_PAGE_SIZE } from '@/types/directory';
import { Suspense } from 'react';

interface IProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function DashboardList({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const parsed = parseDashboardSearchParams(searchParams);
    const { name, page, sort } = parsed;

    const { directories, count: total } = await getUserDirectoriesWithPagination({
        name: Array.isArray(name) ? name[0] : name,
        page: Number.parseInt(page, 10),
        sort: sort ?? 'createdAtDesc'
    });

    if (!directories || directories.length === 0) {
        return <Empty description='Non hai ancora creato nessuna directory. Inizia ora!' />;
    }

    const pages = Math.ceil(total / DIRECTORY_PAGE_SIZE);

    return (
        <>
            <div className='flex flex-col flex-1 p-2 w-full h-full'>
                {directories.map((directory) => (
                    <DashboardCard key={directory.id} item={directory} />
                ))}
            </div>
            <DashboardPagination
                currentPage={Number.parseInt(page, 10)}
                searchParams={parsed}
                totalPages={pages}
                totalResults={total}
            />
        </>
    );
}

export default async function DashboardPage(props: IProps) {
    const { searchParams } = props;
    const waited = await searchParams;

    return (
        <div className="flex flex-col pt-6">
            <div className='flex justify-between items-center px-7'>
                <h1 className="font-brand text-3xl">Dashboard</h1>
                <NavMobile />
            </div>
            <Suspense fallback={<DashboardLoading />}>
                <div className='top-0 z-20 sticky flex flex-col bg-background px-3 py-2.5 border-default border-b w-full'>
                    <DashboardFiltersClient />
                </div>
                <ScrollToTop />
                <DashboardList searchParams={waited} />
            </Suspense>
        </div>
    );
}

function DashboardLoading() {
    return (
        <div className='flex flex-col flex-1 p-2 w-full h-full'>
            {Array.from({ length: 5 }, (_, i) => (
                <DashboardCardSkeleton key={i} />
            ))}
        </div>
    );
}