import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import locationReducer from "./locationSlice";
import shopReducer from "./shopSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    shop: shopReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;