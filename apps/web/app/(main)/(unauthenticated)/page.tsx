import Footer from '@/components/layout/footer';
import NavMobile from '@/components/layout/nav-mobile';
import { CreateDirectoryBlock } from '@/components/modules/homepage/create';
import Hero from '@/components/modules/homepage/hero';
import Newest from '@/components/modules/homepage/newest';
import Popular from '@/components/modules/homepage/popular';
import { Separator } from '@d21/design-system/components/ui/separator';

export default function MainPage() {
    return (
        <div className='mx-auto flex max-w-screen-lg flex-col gap-10 px-2 pt-6 pb-12 sm:px-6 sm:pb-16 md:px-12 md:py-16'>
            <div className='flex items-end justify-end px-4'><NavMobile /></div>
            <div className="flex flex-col gap-10 px-4">
                <Hero />
                <Separator />
            </div>
            <Popular />
            <div className="px-4">
                <Separator />
            </div>
            <CreateDirectoryBlock />
            <div className="px-4">
                <Separator />
            </div>
            <Newest />
            <div className="px-4">
                <Footer />
            </div>
        </div>
    );
}
