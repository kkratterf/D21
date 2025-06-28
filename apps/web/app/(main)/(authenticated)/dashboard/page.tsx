import { getUserDirectoriesWithPagination } from '@/actions/directory';
import NavMobile from '@/components/layout/nav-mobile';
import { DashboardFiltersClient } from '@/components/modules/dashboard/dashboard-filters-client';
import { DashboardPagination } from '@/components/modules/dashboard/pagination';
import ScrollToTop from '@/components/scrollToTopClient';
import DashboardCard from '@/components/ui/dashboard-card';
import Empty from '@/components/ui/empty';
import { parseDashboardSearchParams } from '@/lib/utils';
import { DIRECTORY_PAGE_SIZE } from '@/types/directory';
import { Suspense } from 'react';
import Loading from './loading';

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
        return <Empty title='No directories found' description='You haven’t created any directories yet. Start now!' />;
    }

    const pages = Math.ceil(total / DIRECTORY_PAGE_SIZE);

    return (
        <>
            <div className='flex h-full w-full flex-col gap-1 px-3 py-4'>
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
            <div className='flex items-center justify-between px-7'>
                <h1 className="font-brand text-3xl">Dashboard</h1>
                <NavMobile />
            </div>
            <Suspense fallback={<Loading />}>
                <div className='sticky top-0 z-20 flex w-full flex-col border-default border-b bg-background px-6 py-4'>
                    <DashboardFiltersClient />
                </div>
                <ScrollToTop />
                <DashboardList searchParams={waited} />
            </Suspense>
        </div>
    );
}