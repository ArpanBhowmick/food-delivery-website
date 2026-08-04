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

    clearSelectedShop: (state) => {
      state.selectedShop = null;
    },

    clearShops: (state) => {
      state.shops = [];
      state.selectedShop = null;
    },
  },
});

export const { setShops, setSelectedShop, clearSelectedShop, clearShops } =
  shopSlice.actions;

export default shopSlice.reducer;
