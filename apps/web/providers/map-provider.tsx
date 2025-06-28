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

// Global map instance to persist across Fast Refresh
let globalMap: mapboxgl.Map | null = null;
let globalMapContainer: HTMLDivElement | null = null;

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
}: MapComponentProps) {
  const [isReady, setIsReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const [points, setPoints] = useState<Point[]>([]);
  const initializedRef = useRef(false);

  const addPoint = (point: Point) => {
    setPoints(prev => [...prev, point]);
  };

  const removePoint = (id: string) => {
    setPoints(prev => prev.filter(p => p.id !== id));
  };

  const updatePoint = (id: string, updatedPoint: Partial<Point>) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, ...updatedPoint } : p));
  };

  useEffect(() => {
    if (!resolvedTheme || !mapContainerRef.current) {
      return;
    }

    // If we already have a global map instance, reuse it
    if (globalMap && globalMapContainer === mapContainerRef.current) {
      // Update map style if theme changed
      try {
        const currentStyle = globalMap.getStyle();
        const newStyle = `mapbox://styles/mapbox/${resolvedTheme === 'dark' ? 'dark-v11' : 'light-v11'}`;

        if (currentStyle.sprite !== newStyle) {
          globalMap.setStyle(newStyle);
        }
      } catch (error) {
        // Style not ready yet, skipping style update
      }

      setIsReady(true);
      initializedRef.current = true;
      return;
    }

    // Clean up old map if container changed
    if (globalMap && globalMapContainer !== mapContainerRef.current) {
      globalMap.remove();
      globalMap = null;
      globalMapContainer = null;
    }

    // Create new map only if we don't have one
    if (!globalMap) {
      if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is required');
      }
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const mapStyle = `mapbox://styles/mapbox/${resolvedTheme === 'dark' ? 'dark-v11' : 'light-v11'}`;

      globalMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [initialViewState.longitude, initialViewState.latitude],
        zoom: initialViewState.zoom,
        attributionControl: false,
        logoPosition: "bottom-right",
      });

      globalMapContainer = mapContainerRef.current;

      const handleLoad = () => {
        // Map loaded
      };

      const handleStyleLoad = () => {
        setIsReady(true);
      };

      globalMap.on("load", handleLoad);
      globalMap.on("style.load", handleStyleLoad);

      initializedRef.current = true;
    }

    return () => {
      // Don't destroy the map on component unmount during Fast Refresh
      // Only destroy when the container actually changes
    };
  }, [resolvedTheme, mapContainerRef, initialViewState]);

  // Add resize observer to handle sidebar collapse/expand
  useEffect(() => {
    if (!globalMap || !mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (globalMap) {
        globalMap.resize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapContainerRef]);

  // Show loading until map is completely ready
  if (!globalMap || !isReady || !resolvedTheme) {
    return (
      <div className='inset-0 flex h-full w-full items-center justify-center bg-background'>
        <Loader2 className='size-4 animate-spin stroke-icon' />
      </div>
    );
  }

  return (
    <div className='relative z-0 h-full w-full'>
      <MapContext.Provider
        value={{
          map: globalMap,
          points,
          addPoint,
          removePoint,
          updatePoint,
          isMapReady: true // Always true when we render
        }}
      >
        <MapControls />
        {children}
      </MapContext.Provider>
    </div>
  );
}
