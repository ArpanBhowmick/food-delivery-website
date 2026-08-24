import { useAxiosPrivate } from "@/hook/useAxiosPrivate";
import type { CartItem } from "@/store/cartSlice";
import type { PaymentMethodType } from "@/components/user/checkout/PaymentMethod";

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
    const response = await axiosPrivate.post("/orders/createOrder", {
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

  return {
    createOrder,
    getOrders,
  };
};

export default useOrderApi;
