import { useAxiosPrivate } from "@/hook/useAxiosPrivate";

const useDeliveryApi = () => {
  const axiosPrivate = useAxiosPrivate();

//   get available delivery assignments
  const getAvailableDeliveryAssignments = async () => {
    const response = await axiosPrivate.get(
      "/delivery/availableAssignments",
    );

    return response.data;
  };

//   accept delivery assignment
const acceptDeliveryAssignment = async (
  deliveryAssignmentId: string,
) => {
  const response = await axiosPrivate.patch(
    `/delivery/${deliveryAssignmentId}/accept`,
  );

  return response.data;
};

//   get my active deliveries
const getMyActiveDeliveries = async () => {
  const response = await axiosPrivate.get("/delivery/activeAssignments");

  return response.data;
}

//   verify pickup code
const verifyPickupCode = async (pickupCode: string) => {
  const response = await axiosPrivate.post(
    "/delivery/verifyPickupCode",
    {
      pickupCode,
    },
  );

  return response.data;
};


//   confirm pickup
const confirmPickup = async (deliveryAssignmentId: string) => {
  const response = await axiosPrivate.patch(
    `/delivery/${deliveryAssignmentId}/confirmPickup`,
  );

  return response.data;
}; 


// request delivery OTP
const requestDeliveryOtp = async (deliveryAssignmentId: string) => {
  const response = await axiosPrivate.post(
    `/delivery/${deliveryAssignmentId}/requestDeliveryOtp`,
  );

  return response.data;
};


// verify delivery OTP

const verifyDeliveryOtp = async (
  deliveryAssignmentId: string,
  deliveryOtp: string,
) => {
  const response = await axiosPrivate.patch(
    `/delivery/${deliveryAssignmentId}/verifyDeliveryOtp`,
    {
      deliveryOtp,
    },
  );

  return response.data;
};

  return {
    getAvailableDeliveryAssignments,
    acceptDeliveryAssignment,
    getMyActiveDeliveries,
    verifyPickupCode,
    confirmPickup,
    requestDeliveryOtp,
    verifyDeliveryOtp,
  };
};

export default useDeliveryApi;