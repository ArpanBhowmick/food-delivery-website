import axios from "axios";

// Input location.
interface LocationPoint {
  latitude: number;
  longitude: number;
}

// Map route point.
interface RoutePoint {
  latitude: number;
  longitude: number;
}

// Geoapify coordinate pair.
type GeoapifyCoordinate = [number, number];

// GeoJSON route geometry.
type GeoapifyRouteGeometry =
  | {
      type: "LineString";
      coordinates: GeoapifyCoordinate[];
    }
  | {
      type: "MultiLineString";
      coordinates: GeoapifyCoordinate[][];
    };

// Geoapify route feature.
interface GeoapifyRouteFeature {
  geometry: GeoapifyRouteGeometry;
}

// Geoapify response.
interface GeoapifyRouteResponse {
  features?: GeoapifyRouteFeature[];
}

// Delivery route hook.
const useDeliveryRoute = () => {
  // Get route points.
  const getRoute = async (
    start: LocationPoint,
    destination: LocationPoint,
  ): Promise<RoutePoint[]> => {
    // Check coordinates.
    if (
      !Number.isFinite(start.latitude) ||
      !Number.isFinite(start.longitude) ||
      !Number.isFinite(destination.latitude) ||
      !Number.isFinite(destination.longitude)
    ) {
      return [];
    }

    // Request route from Geoapify.
    try {
      const response = await axios.get<GeoapifyRouteResponse>(
        "https://api.geoapify.com/v1/routing",
        {
          params: {
            waypoints: `${start.latitude},${start.longitude}|${destination.latitude},${destination.longitude}`,
            mode: "scooter",
            format: "geojson",
            apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
          },
        },
      );

      // Read route geometry.
      const geometry = response.data.features?.[0]?.geometry;

      // Return empty route if unavailable.
      if (!geometry || geometry.coordinates.length === 0) {
        return [];
      }

      // Flatten multi-line routes.
      const coordinates =
        geometry.type === "MultiLineString"
          ? geometry.coordinates.flat()
          : geometry.coordinates;

      // Convert coordinates for the map.
      return coordinates.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      }));
    } catch (error) {
      // Handle API errors.
      console.error("Delivery route calculation failed:", error);
      return [];
    }
  };

  // Expose the route function.
  return { getRoute };
};

export default useDeliveryRoute;