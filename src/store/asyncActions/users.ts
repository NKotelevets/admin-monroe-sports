import { createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../api";
import {
  CheckEmailRequestParamsI,
  FinishResetPasswordRequestParamsI,
  LoginRequestParamsI,
  RegisterRequestParamsI,
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

export const checkEmail = createAsyncThunk(
  "users/checkEmail",
  async (params: CheckEmailRequestParamsI, { rejectWithValue }) => {
    try {
      const { data } = await api.users.userCheckEmail(params);

      return data.exists;
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

export const register = createAsyncThunk(
  "users/register",
  async (body: RegisterRequestParamsI, { rejectWithValue }) => {
    try {
      const { data } = await api.users.userRegister(body);

      console.log(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
