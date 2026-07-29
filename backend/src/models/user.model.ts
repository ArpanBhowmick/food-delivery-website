import mongoose, { Document } from "mongoose";

interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
}

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  role: "user" | "owner" | "deliveryBoy";
  password?: string;
  provider: "local" | "google";
  defaultAddress?: ILocation;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true,
    },

    password: {
      type: String,

      minlength: 6,
      required: function (this: IUser): boolean {
        return this.provider === "local";
      },
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    defaultAddress: {
      address: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: "",
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
