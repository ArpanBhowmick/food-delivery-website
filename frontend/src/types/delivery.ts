export interface DeliveryRequest {
  deliveryAssignmentId: string;
  orderId: string;
  shopOrderId: string;
  pickupCode?: string;

 shop: {
  name: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
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

  status?: "available" | "accepted" | "pickedUp" | "delivered";
}