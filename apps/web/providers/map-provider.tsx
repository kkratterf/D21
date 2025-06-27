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
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const childrenRef = useRef(children);
  const mapStyleRef = useRef<string | null>(null); // Track map style in ref to survive Fast Refresh

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
    if (!mapStyleRef.current) {
      setMapStyle(newStyle);
      mapStyleRef.current = newStyle;
    }
  }, [resolvedTheme]);

  // Update map style when theme changes
  useEffect(() => {
    console.log('🌙 MapProvider: Theme change detected', { resolvedTheme, map: !!map.current });

    if (!map.current || !resolvedTheme) return;

    const newStyle = `mapbox://styles/mapbox/${resolvedTheme === 'dark' ? 'dark-v11' : 'light-v11'}`;
    console.log('🎨 MapProvider: New style:', newStyle, 'Current style sprite:', map.current.getStyle().sprite);

    // Update the map style if it's different from current
    if (map.current.getStyle().sprite !== newStyle) {
      console.log('🔄 MapProvider: Changing map style...');
      setIsChangingTheme(true);
      map.current.setStyle(newStyle);
      setMapStyle(newStyle);
      mapStyleRef.current = newStyle;
    } else {
      console.log('✅ MapProvider: Style already matches, no change needed');
    }
  }, [resolvedTheme]);

  // Initialize map
  useEffect(() => {
    console.log('🔄 MapProvider: Initializing map...', {
      mapContainerRef: !!mapContainerRef.current,
      map: !!map.current,
      mapStyle,
      mapStyleRef: mapStyleRef.current
    });

    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is required');
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    // Use ref value if state is reset during Fast Refresh
    const currentMapStyle = mapStyle || mapStyleRef.current;

    if (!mapContainerRef.current || map.current || !currentMapStyle) {
      console.log('🚫 MapProvider: Skipping initialization', {
        hasContainer: !!mapContainerRef.current,
        hasMap: !!map.current,
        hasStyle: !!currentMapStyle
      });
      return;
    }

    console.log('🗺️ MapProvider: Creating new map with style:', currentMapStyle);
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: currentMapStyle,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    const handleLoad = () => {
      console.log('✅ MapProvider: Map loaded');
      setLoaded(true);
    };

    const handleStyleLoad = () => {
      console.log('🎨 MapProvider: Style loaded');
      setIsMapReady(true);
      setIsChangingTheme(false);
    };

    map.current.on("load", handleLoad);
    map.current.on("style.load", handleStyleLoad);

    return () => {
      console.log('🧹 MapProvider: Cleaning up map');
      // Set isMapReady to false first to prevent markers from trying to add themselves
      setIsMapReady(false);
      setLoaded(false);

      // Small delay to ensure all components have time to react to isMapReady change
      setTimeout(() => {
        if (map.current) {
          map.current.off("load", handleLoad);
          map.current.off("style.load", handleStyleLoad);
          map.current.remove();
          map.current = null;
        }
      }, 0);
    };
  }, [initialViewState, mapContainerRef, mapStyle]);

  if (!map.current || !loaded || !resolvedTheme || isChangingTheme) {
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
