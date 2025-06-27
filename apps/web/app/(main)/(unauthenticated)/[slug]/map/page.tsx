"use client";

import StartupMarkers from "@/components/map/startup-markers";
import { useStartups } from "@/hooks/use-startups";
import MapProvider from "@/providers/map-provider";
import { useParams } from "next/navigation";
import { useRef } from "react";

export default function MapPage() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const params = useParams();
    const slug = params.slug as string;
    const { startups, loading, error } = useStartups(slug);

    return (
        <div className='h-screen w-screen'>
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