import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { createTypedSelector } from "../utils";
import { login } from "../asyncActions/users";

interface UsersReducerI {
  isAuth: boolean;
}

const initialState: UsersReducerI = {
  isAuth: false,
};

export const getIsAuthUserSelector = createTypedSelector(
  (state) => state.users.isAuth
);

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [login.pending.type]: (state) => {
      state.isAuth = false;
    },
    [login.fulfilled.type]: (state) => {
      state.isAuth = true;
    },
    [login.rejected.type]: (state) => {
      state.isAuth = false;
    },
  },
});

export default usersSlice.reducer;
