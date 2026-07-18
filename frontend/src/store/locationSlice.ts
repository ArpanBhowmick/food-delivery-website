import type { DefaultAddress } from "@/types/auth.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



const initialState: DefaultAddress = {
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  latitude: null,
  longitude: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<DefaultAddress>) => {
      state.address = action.payload.address;
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.country = action.payload.country;
      state.pincode = action.payload.pincode;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    clearLocation: () => initialState,
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
