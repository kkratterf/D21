import { Suspense } from 'react';

import Loading from '@/components/modules/homepage/loading';
import { HomepageCard, SeeAllCard, } from '@/components/ui/homepage-card';
import { getFeaturedDirectories } from '@/actions/directory';

const PopularStartups = async () => {
  const featuredDirectories = await getFeaturedDirectories();

  return (
    <div className="flex flex-col gap-1">
      {featuredDirectories.map((item) => (
        <HomepageCard key={item.id} item={item} />
      ))}
    </div>
  );
};

const Popular = () => {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-4 font-base font-brand text-heading-section">
        Popular directories
      </h2>
      <div className='flex flex-col gap-1'>
        <Suspense fallback={<Loading />}>
          <PopularStartups />
        </Suspense>
        <SeeAllCard />
      </div>
    </section>
  );
};

export default Popular;
