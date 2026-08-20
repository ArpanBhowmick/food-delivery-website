import axios from "axios";

export interface SearchLocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

const useForwardGeocode = () => {
  const searchLocation = async (
    query: string,
  ): Promise<SearchLocationData | null> => {
    try {
      const response = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
          params: {
            text: query,
            format: "json",
            limit: 1,
            filter: "countrycode:in",
            apiKey: import.meta.env.VITE_GEOAPIFY_API_KEY,
          },
        },
      );

      const result = response.data.results?.[0];

      if (!result) {
        return null;
      }

      return {
        address: result.formatted || "",
        city: result.city || "",
        state: result.state || "",
        country: result.country || "",
        pincode: result.postcode || "",
        latitude: result.lat,
        longitude: result.lon,
      };
    } catch (error) {
      console.error("Forward geocoding failed:", error);
      return null;
    }
  };

  return { searchLocation };
};

export default useForwardGeocode;