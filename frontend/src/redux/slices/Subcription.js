import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  plan: "",
  tokens: null,
  savedServicesLimit: null,
  expiresAt: null,
  status: "",
};

const subscriptionSlice = createSlice({
  name: "subscription",

  initialState,

  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setPlan: (state, action) => {
      state.plan = action.payload;
    },

    setTokens: (state, action) => {
      state.tokens = action.payload;
    },

    setSavedServicesLimit: (state, action) => {
      state.savedServicesLimit = action.payload;
    },

    setSubscription: (state, action) => {
      state.email = action.payload.email ?? "";
      state.plan = action.payload.plan ?? "";
      state.tokens = action.payload.tokens ?? null;
      state.savedServicesLimit = action.payload.savedServicesLimit ?? null;

      state.expiresAt = action.payload.expiresAt ?? null;
      state.status = action.payload.status ?? "";
    },

    clearSubscription: (state) => {
      state.email = "";
      state.plan = "";
      state.tokens = null;
      state.savedServicesLimit = null;
      state.expiresAt = null;
      state.status = "";
    },
  },
});

export const {
  setEmail,
  setPlan,
  setTokens,
  setSavedServicesLimit,
  setSubscription,
  clearSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
