import { getDirectoriesWithPagination } from '@/actions/directory';
import { DirectoryPagination } from '@/components/modules/directories/pagination';
import DirectoryCard from '@/components/ui/directory-card';
import Empty from '@/components/ui/empty';
import { parseDirectorySearchParams } from '@/lib/utils';
import { DIRECTORY_PAGE_SIZE, defaultDirectorySorting } from '@/types/directory';

interface IProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
    const { searchParams } = props;
    const waited = await searchParams;
    const parsed = parseDirectorySearchParams(waited);
    const { name, page, tags, location, sort } = parsed;

    const { directories, count: total } = await getDirectoriesWithPagination({
        name: Array.isArray(name) ? name[0] : name,
        page: Number.parseInt(page, 10),
        tags: tags?.split(','),
        locations: location?.split(','),
        sort: sort ?? defaultDirectorySorting
    });

    if (!directories) {
        return <Empty title="Something went wrong" description="But hey, don't give up! Try again later." />;
    }

    const pages = Math.ceil(total / DIRECTORY_PAGE_SIZE);

    return (
        <>
            <div className='flex h-full w-full flex-col gap-1 px-3 py-4'>
                {directories.length === 0 ? (
                    <Empty title='No directories found' description="Don't give up! Try modifying the filters and see what comes out." />
                ) : (
                    directories.map((directory) => (
                        <DirectoryCard
                            key={directory.id}
                            item={directory}
                            selectedTags={tags?.split(',') || []}
                        />
                    ))
                )}
            </div>
            <DirectoryPagination
                currentPage={Number.parseInt(page, 10)}
                searchParams={parsed}
                totalPages={pages}
                totalResults={total}
            />
        </>
    );
}