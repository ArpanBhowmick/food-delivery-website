import { useCallback } from "react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";
import Map from "./VisualMap";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (
    latitude: number,
    longitude: number,
  ) => void;
}

const LocationMap = ({
  latitude,
  longitude,
  onLocationChange,
}: LocationMapProps) => {
  const handleDragEnd = useCallback(
    (map: L.Map) => {
      const center = map.getCenter();

      onLocationChange(center.lat, center.lng);
    },
    [onLocationChange],
  );

  return (
    <div className="relative">
      <Map
        latitude={latitude}
        longitude={longitude}
        zoom={16}
        onDragEnd={handleDragEnd}
      />

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