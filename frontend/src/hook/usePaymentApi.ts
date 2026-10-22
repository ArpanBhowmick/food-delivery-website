import { useAxiosPrivate } from "./useAxiosPrivate";

const usePaymentApi = () => {
  const axiosPrivate = useAxiosPrivate();

  // Explicit user cancellation of the QR payment drawer.
  const cancelQrCode = async (qrCodeId: string) => {
    const response = await axiosPrivate.post("/payment/qr/cancel", {
      qrCodeId,
    });

    return response.data;
  };

  // Explicit user expiration of the QR payment drawer.
const expireQrCode = async (qrCodeId: string) => {
  const response = await axiosPrivate.post("/payment/qr/expire", {
    qrCodeId,
  });

  return response.data;
};

  return {
    cancelQrCode,
    expireQrCode,
  };
};

export default usePaymentApi;
