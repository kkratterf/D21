"use client";

import { useMap } from "@/context/map-context";
import { Avatar, AvatarFallback, AvatarImage } from "@d21/design-system/components/ui/avatar";
import { Tooltip, TooltipProvider } from "@d21/design-system/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";
import Marker from "./map-marker";

interface Startup {
    id: string;
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
    logo?: string;
    industry?: string;
    logoUrl?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
    slug?: string;
    tags?: string[];
    teamSize?: { name: string } | null;
    fundingStage?: { name: string } | null;
    directory?: {
        id: string;
        name: string;
        slug: string;
    };
}

interface StartupMarkersProps {
    startups: Startup[];
    loading?: boolean;
}

function isValidLatitude(lat: number | null): lat is number {
    return lat !== null && Number.isFinite(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng: number | null): lng is number {
    return lng !== null && Number.isFinite(lng) && lng >= -180 && lng <= 180;
}

// Funzione per calcolare il bounding box dei marker
function calculateBoundingBox(startups: Startup[]) {
    const validStartups = startups.filter(startup =>
        isValidLatitude(startup.latitude) && isValidLongitude(startup.longitude)
    );

    if (validStartups.length === 0) return null;

    const latitudes = validStartups.map(s => s.latitude);
    const longitudes = validStartups.map(s => s.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
        minLat,
        maxLat,
        minLng,
        maxLng,
        centerLat: (minLat + maxLat) / 2,
        centerLng: (minLng + maxLng) / 2
    };
}

export default function StartupMarkers({ startups, loading = false }: StartupMarkersProps) {
    const { map, isMapReady } = useMap();
    const hasCenteredRef = useRef(false);
    const [markersReady, setMarkersReady] = useState(false);

    console.log('📍 StartupMarkers: Render', {
        startupsCount: startups.length,
        loading,
        isMapReady,
        markersReady,
        hasCentered: hasCenteredRef.current
    });

    useEffect(() => {
        const handleStartupSelect = (event: CustomEvent) => {
            const { coordinates } = event.detail;
            if (coordinates?.latitude && coordinates?.longitude && map) {
                map.flyTo({
                    center: [coordinates.longitude, coordinates.latitude],
                    zoom: 14,
                    duration: 2000
                });
            }
        };

        window.addEventListener('startupSelect', handleStartupSelect as EventListener);
        return () => {
            window.removeEventListener('startupSelect', handleStartupSelect as EventListener);
        };
    }, [map]);

    // Effetto per centrare la mappa sui marker dopo che sono stati caricati
    useEffect(() => {
        console.log('🎯 StartupMarkers: Checking centering conditions', {
            map: !!map,
            hasCentered: hasCenteredRef.current,
            loading,
            isMapReady,
            markersReady,
            startupsCount: startups.length
        });

        // Aspetta che il caricamento sia completato e che ci siano startup
        if (!map || hasCenteredRef.current || loading || !isMapReady || !markersReady || startups.length === 0) return;

        const validStartups = startups.filter(startup =>
            isValidLatitude(startup.latitude) && isValidLongitude(startup.longitude)
        );

        if (validStartups.length === 0) return;

        console.log('🚀 StartupMarkers: Executing flyTo with', validStartups.length, 'valid startups');

        // Centra immediatamente senza timer
        const boundingBox = calculateBoundingBox(validStartups);

        if (boundingBox) {
            map.flyTo({
                center: [boundingBox.centerLng, boundingBox.centerLat],
                zoom: 4,
                duration: 1500
            });
            hasCenteredRef.current = true;
            console.log('✅ StartupMarkers: flyTo completed');
        }
    }, [map, startups, loading, isMapReady, markersReady]);

    // Marca i marker come pronti dopo che sono stati renderizzati
    useEffect(() => {
        if (isMapReady && startups.length > 0) {
            console.log('⏰ StartupMarkers: Setting timer for markers ready');
            // Aspetta che tutti i marker siano renderizzati
            const timer = setTimeout(() => {
                console.log('✅ StartupMarkers: Markers ready');
                setMarkersReady(true);
            }, 500); // Aumentato per dare più tempo ai marker di renderizzarsi
            return () => clearTimeout(timer);
        }
    }, [isMapReady, startups.length]);

    // Non renderizzare i marker se la mappa non è pronta o se è in loading
    if (loading || !isMapReady) {
        console.log('🚫 StartupMarkers: Not rendering markers', { loading, isMapReady });
        return null;
    }

    return (
        <>
            {startups.map((startup) =>
                isValidLatitude(startup.latitude) && isValidLongitude(startup.longitude) ? (
                    <Marker
                        key={startup.id}
                        longitude={startup.longitude}
                        latitude={startup.latitude}
                        data={{
                            type: 'Feature',
                            properties: {
                                name: startup.name,
                                imageUrl: startup.logoUrl || "",
                                mapbox_id: startup.id,
                                feature_type: 'startup',
                                coordinates: {
                                    latitude: startup.latitude,
                                    longitude: startup.longitude
                                },
                                context: {
                                    country: {
                                        name: 'Italy',
                                        country_code: 'IT',
                                        country_code_alpha_3: 'ITA'
                                    }
                                }
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [startup.longitude, startup.latitude]
                            }
                        }}
                    >
                        <TooltipProvider delayDuration={200}>
                            <Tooltip side="top" content={startup.name}>
                                <div className='border-0 bg-transparent p-0'>
                                    <Avatar className='size-9 transform rounded-lg border border-default transition-all duration-200 hover:scale-110'>
                                        <AvatarImage src={startup.logoUrl || ""} />
                                        <AvatarFallback>{startup.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </Tooltip>
                        </TooltipProvider>
                    </Marker>
                ) : null
            )}
        </>
    );
} 