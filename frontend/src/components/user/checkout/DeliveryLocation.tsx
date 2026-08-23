import { useCallback, useEffect, useRef, useState } from "react";
import { LocateFixed, Search, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store/store";
import { setLocation } from "@/store/locationSlice";
import useLocation from "@/hook/useLocation";
import useReverseGeocode from "@/hook/useReverseGeocode";
import LocationMap from "@/components/map/LocationMap";
import useForwardGeocode from "@/hook/useForwardGeocode";

const DEFAULT_LATITUDE = 22.5726;
const DEFAULT_LONGITUDE = 88.3639;

const DeliveryLocation = () => {
  const { searchLocation } = useForwardGeocode();
  const dispatch = useDispatch<AppDispatch>();

  const location = useSelector((state: RootState) => state.location);

  const getCurrentLocation = useLocation();
  const { reverseGeocode } = useReverseGeocode();

  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(location.address);

  const reverseGeocodeRef = useRef(reverseGeocode);
  reverseGeocodeRef.current = reverseGeocode;

  const latitude = location.latitude ?? DEFAULT_LATITUDE;

  const longitude = location.longitude ?? DEFAULT_LONGITUDE;

  //  Called whenever the user drags the map.

  const handleLocationChange = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setLoading(true);

        const locationData = await reverseGeocodeRef.current(
          latitude,
          longitude,
        );

        if (!locationData) {
          return;
        }

        dispatch(setLocation(locationData));
      } catch (error) {
        console.error("Failed to update delivery location:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  const handleCurrentLocation = async () => {
    setLoading(true);

    try {
      const success = await getCurrentLocation();

      if (!success) {
        console.log("Unable to get current location.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchValue(location.address);
  }, [location.address]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    try {
      setLoading(true);

      const result = await searchLocation(searchValue);

      if (!result) {
        console.log("Location not found");
        return;
      }

      dispatch(setLocation(result));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-6">
      {/* Heading */}
      <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-gray-900">
        <LocateFixed className="h-4 w-4 text-red-500" />
        Delivery Location
      </h3>

      {/* Address */}
      <div className="flex items-center gap-1">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search or enter your delivery address"
            className="h-9 w-full rounded-lg border border-slate-400 bg-white px-3 pr-10 text-xs text-gray-900 placeholder:text-slate-400 focus:border-[#581c87] focus:outline-none focus:ring-1 focus:ring-[#581c87]/50"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || !searchValue.trim()}
            className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Search location"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Search className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Current location */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={loading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          title="Use current location"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Map */}
      <div className="mt-2">
        <LocationMap
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleLocationChange}
        />
      </div>
    </section>
  );
};

export default DeliveryLocation;
