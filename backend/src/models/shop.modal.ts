import mongoose, { Document } from "mongoose";

interface IGeoLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IShop extends Document {
  name: string;
  image?: {
    url: string;
    publicId: string;
  };
  owner: mongoose.Types.ObjectId;
  city: string;
  state: string;
  address: string;
  location: IGeoLocation;
}

const shopSchema = new mongoose.Schema<IShop>(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      url: {
        type: String,
        // default: "",
      },
      publicId: {
        type: String,
        // default: "",
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true },
);

shopSchema.index({ location: "2dsphere" });

export const Shop = mongoose.model<IShop>("Shop", shopSchema);

// User (U1)
//       │
//       │ owns
//       ▼
// Shop (S1)
//       │
//       │ has
//       ▼
// Item (I1)
