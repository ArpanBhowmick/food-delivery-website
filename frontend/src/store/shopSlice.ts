import type { IShop } from "@/types/shop.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ShopState {
  shops: IShop[];
  selectedShop: IShop | null;
}

const initialState: ShopState = {
  shops: [],
  selectedShop: null,
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShops: (state, action: PayloadAction<IShop[]>) => {
      state.shops = action.payload;
    },

    setSelectedShop: (state, action: PayloadAction<IShop>) => {
      state.selectedShop = action.payload;
    },

    removeShop: (state, action: PayloadAction<string>) => {
      state.shops = state.shops.filter((shop) => shop._id !== action.payload);
    },

    deactivateShop: (state, action: PayloadAction<string>) => {
      const shop = state.shops.find((shop) => shop._id === action.payload);

      if (shop) {
        shop.isActive = false;
      }
    },

    clearSelectedShop: (state) => {
      state.selectedShop = null;
    },

    clearShops: (state) => {
      state.shops = [];
      state.selectedShop = null;
    },
  },
});

export const {
  setShops,
  setSelectedShop,
  removeShop,
  deactivateShop,
  clearSelectedShop,
  clearShops,
} = shopSlice.actions;

export default shopSlice.reducer;
