"use client";

import mapboxgl from "mapbox-gl";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapControls from "@/components/map/map-controls";
import { MapContext, type Point } from "@/context/map-context";
import { Loader2 } from "lucide-react";

type MapComponentProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
}: MapComponentProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { theme, systemTheme, resolvedTheme } = useTheme();
  const [points, setPoints] = useState<Point[]>([]);
  const [mapStyle, setMapStyle] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const childrenRef = useRef(children);

  const addPoint = (point: Point) => {
    setPoints(prev => [...prev, point]);
  };

  const removePoint = (id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
  };

  const updatePoint = (id: string, updatedPoint: Partial<Point>) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, ...updatedPoint } : p));
  };

  // Update children ref when it changes
  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  // Initialize map style - aspetta che il tema sia risolto
  useEffect(() => {
    if (!resolvedTheme) return; // Aspetta che il tema sia risolto

    const newStyle = `mapbox://styles/mapbox/${resolvedTheme === 'dark' ? 'dark-v11' : 'light-v11'}`;

    // Imposta lo stile solo se non è già stato impostato
    if (!mapStyle) {
      setMapStyle(newStyle);
    }
  }, [resolvedTheme, mapStyle]);

  // Initialize map
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is required');
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapContainerRef.current || map.current || !mapStyle) return;

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    const handleLoad = () => {
      setLoaded(true);
    };

    const handleStyleLoad = () => {
      setIsMapReady(true);
    };

    map.current.on("load", handleLoad);
    map.current.on("style.load", handleStyleLoad);

    return () => {
      if (map.current) {
        map.current.off("load", handleLoad);
        map.current.off("style.load", handleStyleLoad);
        map.current.remove();
        map.current = null;
      }
      setLoaded(false);
      setIsMapReady(false);
    };
  }, [initialViewState, mapContainerRef, mapStyle]);

  if (!map.current || !loaded || !resolvedTheme) {
    return (
      <div className='inset-0 flex h-full w-full items-center justify-center bg-background'>
        <Loader2 className='size-4 animate-spin' />
      </div>
    );
  }

  return (
    <div className="z-0">
      <MapContext.Provider
        value={{
          map: map.current,
          points,
          addPoint,
          removePoint,
          updatePoint,
          isMapReady
        }}
      >
        <MapControls />
        {children}
      </MapContext.Provider>
    </div>
  );
}
