import { api } from "@/api/axios";
import { logout } from "@/store/authSlice";
import { clearLocation } from "@/store/locationSlice";
import type { AppDispatch } from "@/store/store";

import axios from "axios";
import { useDispatch } from "react-redux";

const useLogout  = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logOut = async () => {
    try {
      await api.post("/auth/logout");

      dispatch(logout());
      dispatch(clearLocation())
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
      throw error;
    }
  };
  return logOut;
};

export default useLogout ;
