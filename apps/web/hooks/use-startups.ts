import { getVisibleStartupsBySlug } from "@/actions/startup";
import type { Startup } from "@/types/startup";
import { useEffect, useState } from "react";

export function useStartups(directorySlug = "C14") {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStartups() {
            try {
                setLoading(true);

                // Load real startups from the specified directory
                const realStartups = await getVisibleStartupsBySlug(directorySlug);

                // Map data for compatibility with the Startup interface
                const mappedStartups: Startup[] = realStartups.map(startup => ({
                    id: startup.id,
                    name: startup.name,
                    shortDescription: startup.shortDescription,
                    longDescription: startup.longDescription,
                    latitude: startup.latitude,
                    longitude: startup.longitude,
                    logoUrl: startup.logoUrl,
                    location: startup.location,
                    websiteUrl: startup.websiteUrl,
                    foundedAt: startup.foundedAt,
                    teamSizeId: startup.teamSizeId,
                    fundingStageId: startup.fundingStageId,
                    contactEmail: startup.contactEmail,
                    linkedinUrl: startup.linkedinUrl,
                    metadata: startup.metadata,
                    tags: startup.tags,
                    createdAt: startup.createdAt,
                    updatedAt: startup.updatedAt,
                    directoryId: startup.directoryId,
                    visible: startup.visible,
                    amountRaised: startup.amountRaised,
                    currency: startup.currency,
                    slug: startup.slug,
                    teamSize: startup.teamSize,
                    fundingStage: startup.fundingStage,
                    directory: startup.directory
                }));

                setStartups(mappedStartups);
                setError(null);
            } catch (err) {
                console.error('Error loading startups:', err);
                setError(err instanceof Error ? err.message : "Error loading startups");
            } finally {
                setLoading(false);
            }
        }

        loadStartups();
    }, [directorySlug]);

    return { startups, loading, error };
} 