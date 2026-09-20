import { useEffect, useRef } from "react";
import { useAxiosPrivate } from "./useAxiosPrivate";

const useUpdateLocation = (
  onLocationChange?: (latitude: number, longitude: number) => void,
) => {
  const axiosPrivate = useAxiosPrivate();
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported.");
      return;
    }

    const positionOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000,
    };

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        onLocationChange?.(latitude, longitude);

        console.log("Delivery boy location:", {
          latitude,
          longitude,
        });

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return;
        }

        const now = Date.now();

        if (now - lastUpdateRef.current < 30_000) {
          return;
        }

        lastUpdateRef.current = now;

        try {
          const response = await axiosPrivate.put("/user/location/current", {
            latitude,
            longitude,
          });

          console.log("Location API response:", response.data);
        } catch (error) {
          console.error("Failed to update delivery boy location:", error);
        }
      },
      (error) => {
        console.error("Location tracking error:", error);
      },
      positionOptions,
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [axiosPrivate, onLocationChange]);
};

export default useUpdateLocation;
