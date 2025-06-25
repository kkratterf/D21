import type mapboxgl from "mapbox-gl";
import { createContext, useContext } from "react";

export interface Point {
  id: string;
  longitude: number;
  latitude: number;
  title?: string;
  description?: string;
}

interface MapContextType {
  map: mapboxgl.Map | null;
  points: Point[];
  addPoint: (point: Point) => void;
  removePoint: (id: string) => void;
  updatePoint: (id: string, point: Partial<Point>) => void;
  isMapReady: boolean;
}

export const MapContext = createContext<MapContextType | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
