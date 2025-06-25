import Footer from "@/components/layout/footer";
import NavMobile from "@/components/layout/nav-mobile";
import { PartnersGrid } from "@/components/modules/manifesto/partners-grid";
import { partners } from '@/lib/partners';
import { Separator } from "@d21/design-system/components/ui/separator";
import { cn } from "@d21/design-system/lib/utils";
import { focusRing } from "@d21/design-system/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function ManifestoPage() {
    return (
        <div className='mx-auto flex max-w-screen-lg flex-col gap-10 px-2 pt-6 pb-12 sm:px-6 sm:pb-16 md:px-12 md:py-16'>
            <div className='flex items-end justify-end px-4'><NavMobile /></div>
            <div className='flex flex-col gap-10 px-4'>
                <div className="flex flex-col gap-6">
                    <h1 className="font-brand text-4xl">Manifesto</h1>
                    <div className='flex flex-col gap-4'>
                        <p className='text-base text-description'>
                            Every ecosystem has its stories, its geography, its own momentum.
                        </p>
                        <p className='text-base text-description'>
                            To collect, map, and share them is not just an act of documentation — it’s an act of vision.
                        </p>
                        <p className='text-base text-description'>
                            D21 exists for those who see patterns where others see noise.
                        </p>
                        <p className='text-base text-description'>
                            For those who believe that organizing knowledge is a form of progress.
                        </p>
                        <p className='text-base text-description'>
                            That curation is creation. That maps are tools for movement.
                        </p>
                        <p className='text-base text-description'>
                            Ideas don’t recognize borders. They move across industries, cultures, and communities.

                        </p>
                        <p className='text-base text-description'>
                            D21 helps you trace their paths — and draw your own.
                        </p>
                        <p className='text-base text-description'>
                            Because the future of innovation isn’t just built.
                        </p>
                        <p className='text-base text-description'>
                            It’s charted.
                        </p>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-4">
                    <p className="font-mono text-description text-sm">
                        Designed and launched by{' '}
                        <Link
                            target="_blank"
                            href="https://www.linkedin.com/in/kkratter/"
                            className='text hover:text-brand'
                        >
                            Federico Kratter Thaler
                        </Link>{' '}
                        in early 2025
                    </p>
                </div>
                <Separator />
            </div>
            <div className="flex flex-col gap-8">
                <h3 className="px-4 font-brand text-2xl">Partners</h3>
                <PartnersGrid>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                        {partners.map((partner, index) => (
                            <Link
                                target="_blank"
                                href={partner.url}
                                key={index}
                                className={cn('flex h-32 w-full items-center justify-center opacity-70 hover:bg-subtle hover:opacity-90', focusRing)}
                            >
                                <Image
                                    width={160}
                                    height={40}
                                    alt={partner.name}
                                    src={`/images/partners/${partner.image}`}
                                    className='h-12 w-44 px-2 brightness-0 dark:invert'
                                />
                            </Link>
                        ))}
                    </div>
                </PartnersGrid>
            </div>
            <Footer />
        </div>
    )
}