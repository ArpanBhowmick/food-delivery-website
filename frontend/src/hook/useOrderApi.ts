import { useAxiosPrivate } from "@/hook/useAxiosPrivate";
import type { CartItem } from "@/store/cartSlice";
import type { PaymentMethodType } from "@/types/payment";


interface DeliveryAddress {
  text: string;
  latitude: number;
  longitude: number;
}

interface CreateOrderData {
  cartItems: CartItem[];
  paymentMethod: PaymentMethodType;
  deliveryAddress: DeliveryAddress;
}



const useOrderApi = () => {
  const axiosPrivate = useAxiosPrivate();

  // create order
  const createOrder = async ({
    cartItems,
    paymentMethod,
    deliveryAddress,
  }: CreateOrderData) => {
    const response = await axiosPrivate.post("/order/createOrder", {
      cartItems: cartItems.map((cartItem) => ({
        itemId: cartItem.item._id,
        quantity: cartItem.quantity,
      })),
      paymentMethod,
      deliveryAddress,
    });

    return response.data;
  };

  // get orders
  const getOrders = async () => {
    const response = await axiosPrivate.get("/order/getOrders");

    return response.data;
  };

  // update order status
  const updateOrderStatus = async (
    orderId: string,
    shopOrderId: string,
    status: string,
  ) => {
    const response = await axiosPrivate.patch(
      `/order/${orderId}/${shopOrderId}/status`,
      { status },
    );

    return response.data;
  };


  // Verify Razorpay Checkout payment
const verifyCheckoutPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await axiosPrivate.post(
    "/payment/checkout/verify",
    data,
  );

  return response.data;
};

// get shop orders for a specific shop by owner (server-side pagination)
const getShopOrders = async (
  shopId: string,
  page = 1,
  limit = 50
) => {
  const response = await axiosPrivate.get(
    `/order/shop/${shopId}/orders`,
    {
      params: { page, limit },
    }
  );

  return response.data;
};

// Return the API functions from the hook
  return {
    createOrder,
    getOrders,
    updateOrderStatus,
    verifyCheckoutPayment,
    getShopOrders,
  };
};

export default useOrderApi;
