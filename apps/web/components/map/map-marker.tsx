"use client";

import mapboxgl, { type MarkerOptions } from "mapbox-gl";
import type React from "react";
import { useEffect, useRef } from "react";

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
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerInstanceRef = useRef<mapboxgl.Marker | null>(null);

  // Simple useEffect - map is always ready when this renders
  useEffect(() => {
    const markerEl = markerRef.current;

    if (!map || !markerEl) {
      return;
    }

    // Create event handlers
    const handleMouseEnter = () => {
      if (onHover && markerInstanceRef.current) {
        onHover({
          isHovered: true,
          position: { longitude, latitude },
          marker: markerInstanceRef.current,
          data,
        });
      }
    };

    const handleMouseLeave = () => {
      if (onHover && markerInstanceRef.current) {
        onHover({
          isHovered: false,
          position: { longitude, latitude },
          marker: markerInstanceRef.current,
          data,
        });
      }
    };

    const handleClick = () => {
      if (onClick && markerInstanceRef.current) {
        onClick({
          position: { longitude, latitude },
          marker: markerInstanceRef.current,
          data,
        });
      }
    };

    // Add event listeners
    markerEl.addEventListener("mouseenter", handleMouseEnter);
    markerEl.addEventListener("mouseleave", handleMouseLeave);
    markerEl.addEventListener("click", handleClick);

    // Create marker
    try {
      const options: MarkerOptions = {
        element: markerEl,
        ...props,
      };

      const newMarker = new mapboxgl.Marker(options)
        .setLngLat([longitude, latitude])
        .addTo(map);

      markerInstanceRef.current = newMarker;
    } catch (error) {
      console.error('Error adding marker', error);

      // Clean up event listeners on error
      markerEl.removeEventListener("mouseenter", handleMouseEnter);
      markerEl.removeEventListener("mouseleave", handleMouseLeave);
      markerEl.removeEventListener("click", handleClick);
    }

    // Cleanup function
    return () => {
      // Remove marker instance
      if (markerInstanceRef.current) {
        try {
          markerInstanceRef.current.remove();
        } catch (error) {
          // Error removing marker during cleanup
        }
        markerInstanceRef.current = null;
      }

      // Remove event listeners
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", handleMouseEnter);
        markerEl.removeEventListener("mouseleave", handleMouseLeave);
        markerEl.removeEventListener("click", handleClick);
      }
    };
  }, [map, longitude, latitude, data, onHover, onClick]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}
