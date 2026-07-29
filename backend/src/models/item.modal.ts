import mongoose, { Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  image?: {
    url: string;
    publicId: string;
  };
  shop: mongoose.Types.ObjectId;
  category:
    | "Snacks"
    | "Main Courses"
    | "Desserts"
    | "Pizza"
    | "Burgers"
    | "Sandwiches"
    | "South Indian"
    | "North Indian"
    | "Chinese"
    | "Fast Food"
    | "Others";
  price: number;
  foodType: "veg" | "non-veg";
  isAvailable: boolean;
}

const itemSchema = new mongoose.Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
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

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Snacks",
        "Main Courses",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others",
      ],
      required: true,
    },

    price: {
      type: Number,
      min: 1,
      required: true,
    },

    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Item = mongoose.model<IMenuItem>("Item", itemSchema);
