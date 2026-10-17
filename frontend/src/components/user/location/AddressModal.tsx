import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";

import type { AppDispatch, RootState } from "@/store/store";
import { setLocation } from "@/store/locationSlice";
import useLocation from "@/hook/useLocation";
import useReverseGeocode from "@/hook/useReverseGeocode";
import useForwardGeocode from "@/hook/useForwardGeocode";
import LocationMap from "@/components/map/LocationMap";

const DEFAULT_LATITUDE = 22.5726;
const DEFAULT_LONGITUDE = 88.3639;

interface AddressModalProps {
  onClose: () => void;
}

const AddressModal = ({ onClose }: AddressModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const location = useSelector((state: RootState) => state.location);

  const getCurrentLocation = useLocation();
  const { reverseGeocode } = useReverseGeocode();
  const { searchLocation } = useForwardGeocode();

  // null means "show the selected address"; a string means the user is typing.
  const [searchDraft, setSearchDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchValue = searchDraft ?? location.address;

  // Keep the latest reverse geocoder available to the map's drag handler.
  const reverseGeocodeRef = useRef(reverseGeocode);

  useEffect(() => {
    reverseGeocodeRef.current = reverseGeocode;
  }, [reverseGeocode]);

  const latitude = location.latitude ?? DEFAULT_LATITUDE;
  const longitude = location.longitude ?? DEFAULT_LONGITUDE;

  // Called whenever the user drags the map.
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
      setSearchDraft(null);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setLoading(true);

    try {
      const success = await getCurrentLocation();

      if (success) {
        setSearchDraft(null);
      } else {
        console.log("Unable to get current location.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Background overlay */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Modal wrapper */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal content */}
        <div
          className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-[24px] border border-border bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header: icon + title */}
          <div className="mb-5 flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0 text-[#7E22CE]" />
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Location
            </h2>
            <button
              type="button"
              className="ml-auto cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5 stroke-[2]" />
            </button>
          </div>

          {/* Address search bar */}
          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search for delivery address..."
              className="h-12 w-full rounded-xl border border-[#aaa] bg-transparent py-1 pl-11 pr-14 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7E22CE]"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || !searchValue.trim()}
              aria-label="Search location"
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-red-500 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Current-location button */}
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={loading}
            className="mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7E22CE] py-3.5 text-[15px] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            Use Current Location
            <Navigation className="h-4 w-4" fill="currentColor" />
          </button>

          {/* Interactive map */}
          <LocationMap
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleLocationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
