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

    // Controllo rapido: se la mappa è pronta, aggiungi subito il marker
    if (!map || !isMapReady || !markerEl) return;

    // Controllo aggiuntivo per evitare errori durante Fast Refresh
    if (!map.isStyleLoaded || typeof map.isStyleLoaded !== 'function') {
      return;
    }

    // Se la mappa è già caricata, aggiungi il marker immediatamente
    if (map.isStyleLoaded()) {
      addMarker();
    } else {
      // Altrimenti aspetta solo una volta
      const onStyleLoad = () => {
        addMarker();
      };

      map.on('style.load', onStyleLoad);
      return () => {
        map.off('style.load', onStyleLoad);
      };
    }

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
        newMarker = new mapboxgl.Marker(options)
          .setLngLat([longitude, latitude])
          .addTo(map);

        markerRef2.current = newMarker;
      } catch (error) {
        // Ignora errori durante Fast Refresh
        if (process.env.NODE_ENV === 'development') {
          // Marker creation failed during development (likely Fast Refresh)
        } else {
          // Error adding marker
        }
      }

      return () => {
        // Cleanup on unmount
        if (newMarker) newMarker.remove();
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
