import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import useRefreshToken from "./useRefreshToken";
import { socket } from "@/socket/socket";
import type { DeliveryRequest } from "@/types/delivery";

const useSocket = (
  onNewDeliveryRequest?: (request: DeliveryRequest) => void
) => {
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken
  );

  const refreshToken = useRefreshToken();

  useEffect(() => {
    if (!accessToken) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      token: accessToken,
    };

    socket.connect();

    const handleTokenExpired = async () => {
      try {
        const newAccessToken = await refreshToken();

        console.log("New access token received");

        socket.auth = {
          token: newAccessToken,
        };

        socket.connect();
      } catch (error) {
        console.error("Failed to refresh access token:", error);
      }
    };

    const handleNewDeliveryRequest = (request: DeliveryRequest) => {
      console.log("New delivery request:", request);

      onNewDeliveryRequest?.(request);
    };

    socket.on("token_expired", handleTokenExpired);
    socket.on("new_delivery_request", handleNewDeliveryRequest);

    return () => {
      socket.off("token_expired", handleTokenExpired);
      socket.off("new_delivery_request", handleNewDeliveryRequest);
      socket.disconnect();
    };
  }, [accessToken, refreshToken, onNewDeliveryRequest]);
};

export default useSocket;