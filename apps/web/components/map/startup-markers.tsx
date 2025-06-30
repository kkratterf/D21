"use client";

import { useMap } from "@/context/map-context";
import type { Startup } from '@/types/startup';
import { Avatar, AvatarFallback, AvatarImage } from "@d21/design-system/components/ui/avatar";
import { Button } from "@d21/design-system/components/ui/button";
import { Card } from "@d21/design-system/components/ui/card";
import { Separator } from "@d21/design-system/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@d21/design-system/components/ui/sheet";
import { Tag } from "@d21/design-system/components/ui/tag";
import { Tooltip, TooltipProvider } from "@d21/design-system/components/ui/tooltip";
import { Globe, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, } from "react";
import ReactMarkdown from "react-markdown";
import Marker from "./map-marker";

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
                        <Sheet>
                            <SheetTrigger>
                                <Tooltip side="top" content={startup.name}>
                                    <div className='border-0 bg-elevated p-0'>
                                        <Avatar className='size-9 transform rounded-lg border border-default transition-all duration-200 hover:scale-110'>
                                            <AvatarImage src={startup.logoUrl || ""} />
                                            <AvatarFallback>{startup.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </Tooltip>
                            </SheetTrigger>
                            <SheetContent className="gap-6 pt-4 sm:pt-6">
                                <div className='flex w-full flex-col gap-4'>
                                    <div className='flex w-full flex-col gap-3'>
                                        <div className='flex flex-row items-start justify-between gap-3'>
                                            <Avatar className='size-16 rounded-xl border border-border'>
                                                <AvatarImage
                                                    className='transition-all duration-400 group-hover:scale-105'
                                                    src={startup.logoUrl || ""}
                                                    alt={startup.name}
                                                    width={48}
                                                    height={48}
                                                />
                                                <AvatarFallback>
                                                    {startup.name.slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-row gap-1">
                                                {startup.websiteUrl && (
                                                    <Tooltip content="Visit website">
                                                        <Button variant="secondary" icon asChild>
                                                            <Link target="_blank" href={startup.websiteUrl}>
                                                                <Globe />
                                                            </Link>
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                {startup.linkedinUrl && (
                                                    <Button variant="secondary" asChild>
                                                        <Link target="_blank" href={startup.linkedinUrl}>
                                                            Linkedin
                                                        </Link>
                                                    </Button>
                                                )}
                                                <SheetClose asChild>
                                                    <Button icon variant="text">
                                                        <XIcon />
                                                    </Button>
                                                </SheetClose>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <SheetTitle className='!font-brand !text-3xl w-full'>{startup.name}</SheetTitle>
                                            <p className='text-base'>{startup.shortDescription}</p>
                                        </div>
                                    </div>
                                    {startup.tags && startup.tags.length > 0 && (
                                        <div className="flex flex-row gap-1">
                                            {startup.tags.map((tag, index) => (
                                                <Tag
                                                    variant="neutral"
                                                    className='rounded-full border-border bg-background text-description'
                                                    key={index}
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <ReactMarkdown className='prose prose-sm prose-headings:text max-w-none prose-headings:font-brand prose-p:text-description text-base text-description leading-6'>
                                    {startup.longDescription}
                                </ReactMarkdown>
                                <Separator />
                                <Card className='flex w-full flex-col gap-3 bg-transparent'>
                                    {startup.fundingStage && (
                                        <div className='flex flex-row items-center justify-between'>
                                            <p className="font-mono text-description">Funding stage</p>
                                            <p className="font-mono">{startup.fundingStage.name}</p>
                                        </div>
                                    )}
                                    {startup.amountRaised && (
                                        <div className='flex flex-row items-center justify-between'>
                                            <p className="font-mono text-description">Amount raised</p>
                                            <p className="font-mono">{startup.amountRaised.toLocaleString('it-IT')} {startup.currency}</p>
                                        </div>
                                    )}
                                    <div className='flex flex-row items-center justify-between'>
                                        <p className="font-mono text-description">Team size</p>
                                        {startup.teamSize ? (
                                            <p className="font-mono">{startup.teamSize.name}</p>
                                        ) : (
                                            <p className="font-mono">Unknown</p>
                                        )}
                                    </div>
                                    <div className='flex flex-row items-center justify-between'>
                                        <p className="font-mono text-description">Foundation date</p>
                                        <p className="font-mono">{startup.foundedAt ? startup.foundedAt.getFullYear() : 'Unknown'}</p>
                                    </div>
                                    {startup.contactEmail && (
                                        <div className='flex flex-row items-center justify-between'>
                                            <p className="font-mono text-description">Contact email</p>
                                            <p className="font-mono">{startup.contactEmail}</p>
                                        </div>
                                    )}

                                </Card>
                            </SheetContent>
                        </Sheet>
                    </TooltipProvider>
                </Marker>
            ))}
        </>
    );
} 