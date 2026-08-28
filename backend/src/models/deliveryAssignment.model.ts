import mongoose from "mongoose";

interface IBroadcast {
  deliveryBoy: mongoose.Types.ObjectId;
  status: "notified" | "accepted" | "unavailable";
  notifiedAt: Date;
}

export interface IDeliveryAssignment {
  orderId: mongoose.Types.ObjectId;
  shopOrderId: mongoose.Types.ObjectId;

  assignedTo: mongoose.Types.ObjectId | null;

  broadcastedTo: IBroadcast[];

  status: "available" | "accepted" | "pickedUp" | "delivered";

  acceptedAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

const broadcastSchema = new mongoose.Schema({
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["notified", "accepted", "unavailable"],
    default: "notified",
    required: true,
  },

  notifiedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const deliveryAssignmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    broadcastedTo: {
      type: [broadcastSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["available", "accepted", "pickedUp", "delivered"],
      default: "available",
      required: true,
    },

    acceptedAt: {
      type: Date,
    },

    pickedUpAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

deliveryAssignmentSchema.index(
  { orderId: 1, shopOrderId: 1 },
  { unique: true },
);

export const DeliveryAssignment = mongoose.model<IDeliveryAssignment>(
  "DeliveryAssignment",
  deliveryAssignmentSchema,
);
