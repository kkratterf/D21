import { getUserDirectoriesWithPagination } from '@/actions/directory';
import { DashboardPagination } from '@/components/modules/dashboard/pagination';
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
            <div className='flex h-full w-full flex-1 flex-col p-2'>
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
        <Suspense fallback={<DashboardLoading />}>
            <DashboardList searchParams={waited} />
        </Suspense>
    );
}

function DashboardLoading() {
    return (
        <div className='flex h-full w-full flex-1 flex-col p-2'>
            {Array.from({ length: 5 }, (_, i) => (
                <DashboardCardSkeleton key={i} />
            ))}
        </div>
    );
}