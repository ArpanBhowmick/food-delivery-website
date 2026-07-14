import { useNavigate } from "react-router-dom";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useEffect } from "react";
import { api } from "@/api/axios";

export const useAxiosPrivate = () => {
  const navigate = useNavigate();
  const refreshToken = useRefreshToken();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {

    // request interseptor
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (!config.headers?.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // response interceptor
    const responseIntercept = api.interceptors.response.use(

      // Success response
      (response) => response,

      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          try {
            const newAccessToken = await refreshToken();

            // attach new token
            prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // retry original request
            return api(prevRequest);
            
          } catch (error) {

            navigate("/signin", { replace: true });
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );

    // cleanup function
    return () => {
      api.interceptors.request.eject(requestIntercept);

      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  return api;
};

// Since React Router navigation doesn't reload the browser, PersistLogin doesn't run again. Therefore, when the access token expires during normal app usage, the Axios interceptor fetches a new access token using the refresh token and retries the request automatically.
