import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../api";
import { LoginRequestParamsI } from "../../interfaces";

export const login = createAsyncThunk(
  "users/login",
  async (data: LoginRequestParamsI, { rejectWithValue }) => {
    try {
      const res = await api.users.userLogin(data);

      console.log(res);
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
