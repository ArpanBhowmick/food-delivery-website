import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


interface MapRoutePoint {
  latitude: number;
  longitude: number;
}


// Map data model
interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  iconUrl?: string;
}

// Component props
interface MapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  onDragEnd?: (map: L.Map) => void;
  markerIconUrl?: string;
  markers?: MapMarker[];
  route?: MapRoutePoint[];
}



// Main map component
const VisualMap = ({
  latitude,
  longitude,
  zoom = 16,
  onDragEnd,
  markerIconUrl,
  markers = [],
  route = [],
}: MapProps) => {
  // Map refs
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Single map marker ref
  const singleMarkerRef = useRef<L.Marker | null>(null);

  // Collection of dynamic markers by id
  const markersByIdRef = useRef<Map<string, L.Marker>>(new Map());

  const deliveryRouteRef = useRef<L.Polyline | null>(null);

  // Initialize the Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([latitude, longitude], zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (onDragEnd) {
      map.on("dragend", () => {
        onDragEnd(map);
      });
    }

    if (markerIconUrl) {
      const icon = L.icon({
        iconUrl: markerIconUrl,
        iconSize: [50, 40],
        iconAnchor: [20, 20],
      });

      singleMarkerRef.current = L.marker([latitude, longitude], {
        icon,
      }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
  map.remove();
  mapInstanceRef.current = null;
  singleMarkerRef.current = null;
  markersByIdRef.current.clear();
  deliveryRouteRef.current = null;
};
  }, []);

  // Sync batch markers on the map
  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) return;

    const currentMarkers = markersByIdRef.current;
    const markerIds = new Set(markers.map((marker) => marker.id));

    currentMarkers.forEach((marker, id) => {
      if (!markerIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    markers.forEach((markerData) => {
      const existingMarker = currentMarkers.get(markerData.id);

      if (existingMarker) {
        existingMarker.setLatLng([markerData.latitude, markerData.longitude]);
        return;
      }

      const marker = markerData.iconUrl
        ? L.marker([markerData.latitude, markerData.longitude], {
            icon: L.icon({
              iconUrl: markerData.iconUrl,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            }),
          })
        : L.marker([markerData.latitude, markerData.longitude]);

      marker.addTo(map);
      currentMarkers.set(markerData.id, marker);
    });
  }, [markers]);

  // Update map center when coords change
  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map) return;

    map.setView([latitude, longitude], map.getZoom(), {
      animate: true,
    });

    if (singleMarkerRef.current) {
      singleMarkerRef.current.setLatLng([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Sync the delivery route on the map
useEffect(() => {
  const map = mapInstanceRef.current;

  if (!map) return;

  if (deliveryRouteRef.current) {
    deliveryRouteRef.current.remove();
    deliveryRouteRef.current = null;
  }

  if (route.length === 0) return;

  const routeCoordinates = route.map(
    ({ latitude, longitude }) =>
      [latitude, longitude] as L.LatLngExpression,
  );

  deliveryRouteRef.current = L.polyline(routeCoordinates, {
    weight: 5,
  }).addTo(map);
}, [route]);

  // Map container
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-500">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default VisualMap;
