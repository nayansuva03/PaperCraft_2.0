import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  authProvider: "",
  hasPassword: false,
  hasGoogle: false,
  isRegistered: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },

    setLastName: (state, action) => {
      state.lastName = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setAuthProvider: (state, action) => {
      state.authProvider = action.payload;
    },

    setIsRegistered: (state, action) => {
      state.isRegistered = action.payload;
    },

    setUser: (state, action) => {
      state.firstName = action.payload.firstName || "";
      state.lastName = action.payload.lastName || "";
      state.email = action.payload.email || "";
      state.authProvider = action.payload.authProvider || "";
      state.hasPassword = !!action.payload.hasPassword;
      state.hasGoogle = !!action.payload.hasGoogle;
      state.isRegistered = true;
    },

    clearUser: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.authProvider = "";
      state.hasPassword = false;
      state.hasGoogle = false;
      state.isRegistered = false;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setAuthProvider,
  setIsRegistered,
  setUser,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
