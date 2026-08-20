import type { IItem } from "@/types/item.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  item: IItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action: PayloadAction<IItem>) => {
      const item = action.payload;

      const existingItem = state.items.find(
        (cartItem) => cartItem.item._id === item._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          item,
          quantity: 1,
        });
      }
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const cartItem = state.items.find(
        (cartItem) => cartItem.item._id === action.payload
      );

      if (cartItem) {
        cartItem.quantity += 1;
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const cartItem = state.items.find(
        (cartItem) => cartItem.item._id === action.payload
      );

      if (!cartItem) return;

      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        state.items = state.items.filter(
          (cartItem) => cartItem.item._id !== action.payload
        );
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (cartItem) => cartItem.item._id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;