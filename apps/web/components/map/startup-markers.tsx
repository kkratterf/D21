"use client";

import { useMap } from "@/context/map-context";
import { Avatar, AvatarFallback, AvatarImage } from "@d21/design-system/components/ui/avatar";
import { Tooltip, TooltipProvider } from "@d21/design-system/components/ui/tooltip";
import { useEffect, } from "react";
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

function calculateBoundingBox(startups: Startup[]) {
    if (startups.length === 0) return null;

    let minLat = Number.POSITIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;
    let minLng = Number.POSITIVE_INFINITY;
    let maxLng = Number.NEGATIVE_INFINITY;

    for (const startup of startups) {
        if (isValidLatitude(startup.latitude) && isValidLongitude(startup.longitude)) {
            minLat = Math.min(minLat, startup.latitude);
            maxLat = Math.max(maxLat, startup.latitude);
            minLng = Math.min(minLng, startup.longitude);
            maxLng = Math.max(maxLng, startup.longitude);
        }
    }

    if (minLat === Number.POSITIVE_INFINITY || maxLat === Number.NEGATIVE_INFINITY || minLng === Number.POSITIVE_INFINITY || maxLng === Number.NEGATIVE_INFINITY) {
        return null;
    }

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return { centerLat, centerLng, minLat, maxLat, minLng, maxLng };
}

// Global flag to track if we've already centered the map
let hasCenteredMap = false;
let lastMapInstance: mapboxgl.Map | null = null;

export default function StartupMarkers({ startups, loading = false }: StartupMarkersProps) {
    const { map } = useMap();
    const validStartups = startups.filter(startup =>
        isValidLatitude(startup.latitude) && isValidLongitude(startup.longitude)
    );

    // Reset flag if map instance changed
    useEffect(() => {
        if (map && map !== lastMapInstance) {
            hasCenteredMap = false;
            lastMapInstance = map;
        }
    }, [map]);

    // Handle startup selection
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

    // Center map on markers once
    useEffect(() => {
        if (!map || hasCenteredMap || loading || validStartups.length === 0) {
            return;
        }

        const boundingBox = calculateBoundingBox(validStartups);
        if (boundingBox) {
            map.flyTo({
                center: [boundingBox.centerLng, boundingBox.centerLat],
                zoom: 4,
                duration: 1500
            });
            hasCenteredMap = true;
        }
    }, [map, validStartups, loading]);

    // Don't render if loading
    if (loading) {
        return null;
    }

    return (
        <>
            {validStartups.map((startup) => (
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
            ))}
        </>
    );
} 