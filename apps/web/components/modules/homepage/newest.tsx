import { Suspense } from 'react';

import { getDirectories } from '@/actions/directory';
import Loading from '@/components/modules/homepage/loading';
import { HomepageCard, SeeAllCard, } from '@/components/ui/homepage-card';

const NewestStartups = async () => {
    const newestStartups = await getDirectories({
        orderBy: { createdAt: "desc" },
        page: 1,
        limit: 5
    });

    return (
        <div className="flex flex-col gap-1">
            {newestStartups.slice(0, 5).map((item) => (
                <HomepageCard key={item.id} item={item} />
            ))}
        </div>
    );
};

const Newest = () => {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="px-4 font-base font-brand text-heading-section">
                Newest directories
            </h2>
            <div className='flex flex-col gap-1'>
                <Suspense fallback={<Loading />}>
                    <NewestStartups />
                </Suspense>
                <SeeAllCard />
            </div>
        </section>
    );
};

export default Newest;