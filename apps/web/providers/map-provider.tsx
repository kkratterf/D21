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
  const { theme, systemTheme } = useTheme();
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

  // Clean up markers when children change
  useEffect(() => {
    if (!map.current) {
      return;
    }

    // Remove all existing markers
    const markers = document.getElementsByClassName('marker');
    while (markers.length > 0) {
      markers[0].remove();
    }
  }, []);

  // Initialize map style
  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const newStyle = `mapbox://styles/mapbox/${currentTheme === 'dark' ? 'dark-v11' : 'light-v11'}`;
    setMapStyle(newStyle);
  }, [theme, systemTheme]);

  // Initialize map
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is required');
    }
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapContainerRef.current || map.current || !mapStyle) return;

    console.log('Creating new map instance');
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    const handleLoad = () => {
      console.log('Map loaded, setting states');
      setLoaded(true);
      setIsMapReady(true);
    };

    map.current.on("load", handleLoad);
    map.current.on("style.load", handleLoad);

    return () => {
      console.log('Cleaning up map instance');
      if (map.current) {
        map.current.off("load", handleLoad);
        map.current.off("style.load", handleLoad);
        map.current.remove();
        map.current = null;
      }
      setLoaded(false);
      setIsMapReady(false);
    };
  }, [initialViewState, mapContainerRef, mapStyle]);

  // Handle map load state
  useEffect(() => {
    const handleStyleLoad = () => {
      console.log('Style loaded, setting isMapReady to true');
      setIsMapReady(true);
    };

    const currentMap = map.current;
    if (currentMap) {
      currentMap.on('style.load', handleStyleLoad);
      currentMap.on('load', handleStyleLoad);
    }

    return () => {
      if (currentMap) {
        currentMap.off('style.load', handleStyleLoad);
        currentMap.off('load', handleStyleLoad);
      }
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (!map.current || !mapStyle) return;

    const updateStyle = async () => {
      try {
        console.log('Updating map style');
        setIsMapReady(false);
        await map.current?.setStyle(mapStyle);
        // Add a small delay to ensure the style is fully loaded
        setTimeout(() => {
          console.log('Map style updated, setting isMapReady to true');
          setIsMapReady(true);
        }, 100);
      } catch (error) {
        console.error('Error updating map style:', error);
        setIsMapReady(true); // Reset state even on error
      }
    };

    updateStyle();
  }, [mapStyle]);

  if (!map.current || !loaded) {
    console.log('Map not ready:', { map: !!map.current, loaded });
    return null;
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

      {!loaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-subtle'>
          <Loader2 className='size-5 animate-spin' />
        </div>
      )}
    </div>
  );
}