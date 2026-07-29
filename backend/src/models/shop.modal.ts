import mongoose, { Document } from "mongoose";

export interface IShop extends Document {
  name: string;
  image?: {
    url: string ;
    publicId: string;
  };
  owner: mongoose.Types.ObjectId;
  city: string;
  state: string;
  address: string;
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

    // items: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Item"
    // }]
  },
  { timestamps: true },
);

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
