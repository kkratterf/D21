"use client";

import NavMobile from "@/components/layout/nav-mobile";
import StartupMarkers from "@/components/map/startup-markers";
import { useStartups } from "@/hooks/use-startups";
import MapProvider from "@/providers/map-provider";
import { Button } from "@d21/design-system/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";

export default function MapPage() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const params = useParams();
    const slug = params.slug as string;
    const { startups, loading } = useStartups(slug);
    const router = useRouter();

    return (
        <div className='relative h-full w-full'>
            <aside className='absolute top-6 right-6 z-50 rounded-[10px] border border-default bg-elevated p-0.5 shadow-xl md:hidden'>
                <NavMobile />
            </aside>
            <aside className='absolute top-6 left-6 z-20 rounded-[10px] border border-default bg-elevated p-0.5 shadow-xl md:flex md:flex-col'>
                <Button variant="secondary" icon className='cursor-pointer' asChild onClick={() => router.back()}>
                    <ChevronLeft />
                </Button>
            </aside>
            <div
                id="map-container"
                ref={mapContainerRef}
                className='absolute inset-0 h-full w-full'
            />

            <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                    longitude: -122.4194,
                    latitude: 37.7749,
                    zoom: 2,
                }}
            >
                <StartupMarkers startups={startups} loading={loading} />

            </MapProvider>
        </div>
    );
}