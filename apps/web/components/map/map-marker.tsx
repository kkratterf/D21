"use client";

import mapboxgl, { type MarkerOptions } from "mapbox-gl";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";

import { useMap } from "@/context/map-context";
import type { LocationFeature } from "@/lib/map";

type Props = {
  longitude: number;
  latitude: number;
  data: LocationFeature;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props) {
  const { map, isMapReady } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerRef2 = useRef<mapboxgl.Marker | null>(null);
  const propsRef = useRef(props);
  const isAddedRef = useRef(false);

  // Aggiorna il ref delle props quando cambiano
  useEffect(() => {
    propsRef.current = props;
  });

  const handleHover = useCallback((isHovered: boolean) => {
    if (onHover && markerRef2.current) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker: markerRef2.current,
        data,
      });
    }
  }, [onHover, longitude, latitude, data]);

  const handleClick = useCallback(() => {
    if (onClick && markerRef2.current) {
      onClick({
        position: { longitude, latitude },
        marker: markerRef2.current,
        data,
      });
    }
  }, [onClick, longitude, latitude, data]);

  useEffect(() => {
    const markerEl = markerRef.current;

    console.log('📍 Marker: useEffect triggered', {
      map: !!map,
      isMapReady,
      markerEl: !!markerEl,
      coords: [longitude, latitude]
    });

    // Controllo rapido: se la mappa è pronta, aggiungi subito il marker
    if (!map || !isMapReady || !markerEl) return;

    // Enhanced map validation - check multiple conditions
    const isMapValid = () => {
      if (!map) return false;
      if (!map.getContainer) return false;
      const container = map.getContainer();
      if (!container) return false;
      if (!container.parentNode) return false;
      // Check if the map is still in a valid state
      try {
        // Try to access a property that would fail if map is destroyed
        map.getStyle();
        return true;
      } catch (error) {
        console.log('⚠️ Marker: Map is in invalid state:', error);
        return false;
      }
    };

    // Controlla se la mappa è ancora valida prima di procedere
    if (!isMapValid()) {
      console.log('⚠️ Marker: Map is no longer valid, skipping marker addition');
      return;
    }

    // Evita di aggiungere il marker più volte
    if (isAddedRef.current) return;

    console.log('➕ Marker: Adding marker to map');
    // Aggiungi il marker immediatamente se la mappa è pronta
    const cleanup = addMarker();

    // Cleanup function
    return () => {
      console.log('🧹 Marker: Cleaning up marker');
      isAddedRef.current = false;
      if (cleanup) cleanup();
    };

    function addMarker() {
      if (!markerEl) return;

      const handleMouseEnter = () => handleHover(true);
      const handleMouseLeave = () => handleHover(false);

      // Add event listeners
      markerEl.addEventListener("mouseenter", handleMouseEnter);
      markerEl.addEventListener("mouseleave", handleMouseLeave);
      markerEl.addEventListener("click", handleClick);

      // Marker options
      const options: MarkerOptions = {
        element: markerEl,
        ...propsRef.current,
      };

      let newMarker: mapboxgl.Marker | null = null;

      try {
        // Final validation before creating marker
        if (!isMapValid()) {
          console.log('⚠️ Marker: Map became invalid during marker creation');
          return;
        }

        newMarker = new mapboxgl.Marker(options)
          .setLngLat([longitude, latitude])
          .addTo(map);

        markerRef2.current = newMarker;
        isAddedRef.current = true;
        console.log('✅ Marker: Successfully added to map');
      } catch (error) {
        console.error('❌ Marker: Error adding marker', error);
        // Reset the added flag so we can try again later
        isAddedRef.current = false;
        // Ignora errori durante Fast Refresh
        if (process.env.NODE_ENV === 'development') {
          // Marker creation failed during development (likely Fast Refresh)
        } else {
          // Error adding marker
        }
      }

      return () => {
        // Cleanup on unmount
        if (newMarker) {
          try {
            newMarker.remove();
          } catch (error) {
            // Ignora errori se la mappa è già stata distrutta
            console.log('⚠️ Marker: Error removing marker during cleanup:', error);
          }
        }
        if (markerEl) {
          markerEl.removeEventListener("mouseenter", handleMouseEnter);
          markerEl.removeEventListener("mouseleave", handleMouseLeave);
          markerEl.removeEventListener("click", handleClick);
        }
      };
    }
  }, [map, isMapReady, longitude, latitude, handleHover, handleClick]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}
