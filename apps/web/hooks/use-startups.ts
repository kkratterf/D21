import { getVisibleStartupsBySlug } from "@/actions/startup";
import { useEffect, useState } from "react";

interface Startup {
    id: string;
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
    logo?: string;
    industry?: string;
    address?: string;
    website?: string;
    founded?: number;
    employees?: string;
    funding?: string;
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

export function useStartups(directorySlug = "C14") {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadStartups() {
            try {
                setLoading(true);

                // Carica le startup reali dalla directory specificata
                const realStartups = await getVisibleStartupsBySlug(directorySlug);

                // Mappa i dati per compatibilità con l'interfaccia Startup
                const mappedStartups: Startup[] = realStartups.map(startup => ({
                    id: startup.id,
                    name: startup.name,
                    description: startup.description,
                    latitude: startup.latitude,
                    longitude: startup.longitude,
                    logo: startup.logoUrl || undefined,
                    logoUrl: startup.logoUrl || undefined,
                    location: startup.location,
                    website: startup.websiteUrl || undefined,
                    founded: startup.foundedAt ? new Date(startup.foundedAt).getFullYear() : undefined,
                    employees: startup.teamSize?.name,
                    funding: startup.fundingStage?.name,
                    industry: startup.tags?.[0], // Usa il primo tag come industria
                    createdAt: startup.createdAt,
                    updatedAt: startup.updatedAt,
                    slug: startup.slug,
                    tags: startup.tags,
                    teamSize: startup.teamSize,
                    fundingStage: startup.fundingStage,
                    directory: startup.directory
                }));

                setStartups(mappedStartups);
                setError(null);
            } catch (err) {
                console.error('Errore nel caricamento delle startup:', err);
                setError(err instanceof Error ? err.message : "Errore nel caricamento delle startup");
            } finally {
                setLoading(false);
            }
        }

        loadStartups();
    }, [directorySlug]);

    return { startups, loading, error };
} 