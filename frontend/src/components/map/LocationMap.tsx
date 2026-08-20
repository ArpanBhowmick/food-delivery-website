import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (
    latitude: number,
    longitude: number,
  ) => void;
}

const DEFAULT_ZOOM = 16;

const LocationMap = ({
  latitude,
  longitude,
  onLocationChange,
}: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  /*
   * Create map only once.
   */
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      [latitude, longitude],
      DEFAULT_ZOOM,
    );

    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    ).addTo(map);

    const handleDragEnd = () => {
      const center = map.getCenter();

      onLocationChange(
        center.lat,
        center.lng,
      );
    };

    map.on("dragend", handleDragEnd);

    mapInstanceRef.current = map;

    return () => {
      map.off("dragend", handleDragEnd);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onLocationChange]);

  /*
   * Update map position when location changes.
   */
  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) return;

    const currentCenter = map.getCenter();

    if (
      currentCenter.lat === latitude &&
      currentCenter.lng === longitude
    ) {
      return;
    }

    map.setView(
      [latitude, longitude],
      map.getZoom(),
      {
        animate: true,
      },
    );
  }, [latitude, longitude]);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl border border-slate-500">
      <div
        ref={mapRef}
        className="h-full w-full"
      />

      {/* Fixed center marker */}
      <img
        src={markerIcon}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full"
      />
    </div>
  );
};

export default LocationMap;