import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import locationReducer from "./locationSlice";
import shopReducer from "./shopSlice";
import itemReducer from "./ItemSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    shop: shopReducer,
     item: itemReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;