export interface DeliveryRequest {
  deliveryAssignmentId: string;
  orderId: string;
  shopOrderId: string;

  shop: {
    name: string;
    address: string;
  };

  deliveryAddress: {
    text: string;
    latitude: number;
    longitude: number;
  };

  items: {
    item: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];

  itemTotal: number;
}