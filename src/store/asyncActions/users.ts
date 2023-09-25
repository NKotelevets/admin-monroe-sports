import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../api";
import {
  FinishResetPasswordRequestParamsI,
  LoginRequestParamsI,
  StartResetPasswordRequestParamsI,
} from "../../interfaces";
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

export const startResetPassword = createAsyncThunk(
  "users/startResetPassword",
  async (data: StartResetPasswordRequestParamsI, { rejectWithValue }) => {
    try {
      const res = await api.users.userStartResetPassword(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const finishResetPassword = createAsyncThunk(
  "users/finishResetPassword",
  async (data: FinishResetPasswordRequestParamsI, { rejectWithValue }) => {
    try {
      const res = await api.users.userFinishResetPassword(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
