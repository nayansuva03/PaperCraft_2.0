import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/userSlice.js";
import subscriptionReducer from "./slices/Subcription.js";
import themeReducer from "./slices/themeSlice.js";

export const store = configureStore({
  reducer: {
    user: usersReducer,
    subscription: subscriptionReducer,
    theme: themeReducer,
  },
});