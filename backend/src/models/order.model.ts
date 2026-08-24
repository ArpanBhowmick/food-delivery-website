import mongoose from "mongoose";

interface IShopOrderItem {
  item: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface IShopOrder {
  shop: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  items: IShopOrderItem[];
  itemTotal: number;
  orderStatus:
    | "placed"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
}

export interface IOrder {
  user: mongoose.Types.ObjectId;

  shopOrders: IShopOrder[];

  paymentMethod: "cod" | "upi" | "card";

  paymentStatus: "pending" | "paid" | "failed" | "refunded";

  deliveryAddress: {
    text: string;
    latitude: number;
    longitude: number;
  };

  pricing: {
    itemTotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
  };

  orderStatus:
    | "placed"
    | "confirmed"
    | "preparing"
    | "ready"
    | "delivered"
    | "cancelled";
}

// One individual item inside a shop order
const shopOrderItemsSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
  type: String,
  required: true,
},

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

// One shop's portion of the order
const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },

    items: {
      type: [shopOrderItemsSchema],
      required: true,
    },

    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  { _id: true, timestamps: true },
);

// Complete customer order
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopOrders: {
      type: [shopOrderSchema],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    deliveryAddress: {
      text: {
        type: String,
        required: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    pricing: {
      itemTotal: {
        type: Number,
        required: true,
        min: 0,
      },

      deliveryFee: {
        type: Number,
        required: true,
        min: 0,
      },

      discount: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
