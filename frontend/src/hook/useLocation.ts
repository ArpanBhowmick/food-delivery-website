import { setLocation } from "@/store/locationSlice";
import type { AppDispatch } from "@/store/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useAxiosPrivate } from "./useAxiosPrivate";

const useLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const axiosPrivate = useAxiosPrivate();

  const getCurrentLocation = () => {
    return new Promise<boolean>((resolve) => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported.");
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );

            console.log(response.data);

            const currentLocation = {
              address: response.data.display_name,
              city: response.data.address.city ?? "",
              state: response.data.address.state ?? "",
              country: response.data.address.country ?? "",
              pincode: response.data.address.postcode ?? "",
              latitude,
              longitude,
            };

            const {data} = await axiosPrivate.put("/user/location", currentLocation);

            dispatch(setLocation(data.location));

            resolve(true);

          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log(error.message);
            }
            resolve(false);
          }
        },

        // Geolocation error
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

// responibility : Get the user's current location and make it available to the application.
