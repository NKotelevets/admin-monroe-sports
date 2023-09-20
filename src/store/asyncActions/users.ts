import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../api";
import { LoginRequestParamsI } from "../../interfaces";
import { setTokens } from "../../utils/auth";

export const login = createAsyncThunk(
  "users/login",
  async (data: LoginRequestParamsI, { rejectWithValue }) => {
    try {
      const res = await api.users.userLogin(data);
      api.token = res.data.access;
      setTokens(res.data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
