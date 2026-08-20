import axios from "axios";

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

const useReverseGeocode = () => {
  const reverseGeocode = async (
    latitude: number,
    longitude: number,
  ): Promise<LocationData | null> => {
    try {
      const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/reverse",
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
            apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
          },
        },
      );

      const address = response.data.results?.[0];

      if (!address) {
        return null;
      }

      const formattedAddress = [
        address.housenumber,
address.street,
        address.neighbourhood,
        address.suburb,
        address.city || address.town || address.village,
        address.state,
        address.postcode,
        address.country,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        address: formattedAddress,
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        country: address.country || "",
        pincode: address.postcode || "",
        latitude,
        longitude,
      };
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return null;
    }
  };

  return { reverseGeocode };
};

export default useReverseGeocode;

// responsibilities: Take latitude and longitude and convert them into a readable address.
