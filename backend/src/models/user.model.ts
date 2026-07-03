import mongoose, { Document } from "mongoose";

  export interface IUser extends Document{
  name: string;
  email: string;
  mobile: string;
  role: "user" | "owner" | "deliveryBoy";
  password?: string;
  provider: "local" | "google";
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
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
