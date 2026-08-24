export type OrderStatus = 'delivered' | 'processing' | 'cancelled' | 'in-transit';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

export interface Order {
  id: string;
  shopName: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  items: OrderItem[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-982374",
    shopName: "Fresh Greens Supermarket",
    date: "August 20, 2026",
    status: "delivered",
    total: 42.50,
    itemCount: 4,
    items: [
      { id: "i1", name: "Organic Avocados", quantity: 2, image: "/api/placeholder/60/60", price: 12.00 },
      { id: "i2", name: "Sourdough Bread", quantity: 1, image: "/api/placeholder/60/60", price: 6.50 },
    ]
  },
  {
    id: "ORD-982375",
    shopName: "Spice Route Kitchen",
    date: "August 22, 2026",
    status: "processing",
    total: 28.00,
    itemCount: 2,
    items: [
      { id: "i3", name: "Chicken Tikka Masala", quantity: 1, image: "/api/placeholder/60/60", price: 18.00 },
      { id: "i4", name: "Garlic Naan", quantity: 2, image: "/api/placeholder/60/60", price: 10.00 },
    ]
  }
];