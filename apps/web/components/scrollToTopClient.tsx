'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ScrollToTop() {
    const searchParams = useSearchParams();
    const queryString = searchParams.toString();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [queryString]);

    return <div ref={ref} />;
}