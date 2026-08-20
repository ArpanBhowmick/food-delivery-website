import { setLocation } from "@/store/locationSlice";
import type { AppDispatch } from "@/store/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useAxiosPrivate } from "./useAxiosPrivate";
import useReverseGeocode from "./useReverseGeocode";

const useLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const axiosPrivate = useAxiosPrivate();
  const { reverseGeocode } = useReverseGeocode();

  const getCurrentLocation = () => {
    return new Promise<boolean>((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported.");
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          console.log("📍 Browser location:", {
            latitude,
            longitude,
          });

          const currentLocation = await reverseGeocode(latitude, longitude);

          if (!currentLocation) {
            resolve(false);
            return;
          }

          try {
            const { data } = await axiosPrivate.put(
              "/user/location",
              currentLocation,
            );

            

            dispatch(setLocation(data.location));

            resolve(true);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log(error.message);
            }

            resolve(false);
          }
        },
        (error) => {
          console.log(error);
          resolve(false);
        },
      );
    });
  };

  return getCurrentLocation;
};

export default useLocation;



// responsibilities: Get the user's current device location.