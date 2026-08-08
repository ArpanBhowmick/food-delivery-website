import type { IItem } from "@/types/item.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface ItemState {
    items: IItem[];
}

const initialState: ItemState = {
  items: [],
};



const itemSlice = createSlice({
name: "item",
 initialState,
   reducers: {
    setItems: (state, action: PayloadAction<IItem[]>) => {
      state.items = action.payload;
    },

    addItem: (state, action: PayloadAction<IItem>) => {
      state.items.push(action.payload);
    },

    updateItem: (state, action: PayloadAction<IItem>) => {
      state.items = state.items.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    clearItems: (state) => {
      state.items = [];
    },
  },
})


export const {
  setItems,
  addItem,
  updateItem,
  removeItem,
  clearItems,
} = itemSlice.actions;

export default itemSlice.reducer; 

