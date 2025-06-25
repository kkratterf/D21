import { SubmitForm } from '@/components/slug/submit/form'
import { SlugSubmitHeader } from '@/components/slug/submit/header'
import { SubmitLoading } from '@/components/slug/submit/loading'
import { Suspense } from 'react'

interface SubmitPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function SubmitPage({ params }: SubmitPageProps) {
    const { slug } = await params;

    return (
        <div className='flex h-full w-full flex-col'>
            <SlugSubmitHeader />
            <Suspense fallback={<SubmitLoading />}>
                <SubmitForm slug={slug} />
            </Suspense>
        </div>
    )
}
