import { api } from "@/api/axios";
import { setCredentials } from "@/store/authSlice";
import { setLocation } from "@/store/locationSlice";
import type { AppDispatch } from "@/store/store";
import type { AuthResponse } from "@/types/auth.types";
import axios from "axios";
import { useDispatch } from "react-redux";

const useRefreshToken = () => {
  const dispatch = useDispatch<AppDispatch>();

  const refreshToken = async () => {
    try {
      const response = await api.post<AuthResponse>("/auth/refreshToken");

      dispatch(
        setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }),
      );
      
      if (response.data.user.defaultAddress) {
        dispatch(setLocation(response.data.user.defaultAddress));
      }

      //   "User and accessToken are being stored in Redux, and only accessToken is returned to the function caller so that when refreshToken() is called, it can receive the access token."

      return response.data.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        console.log(error.response?.data.message);
      }

      throw error;
      //   "throw error means the error is passed back to the code that called the function, and if that code has a catch block, that catch block will execute."
    }
  };

  return refreshToken;
};

export default useRefreshToken;
