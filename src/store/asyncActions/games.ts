import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const getGameList = createAsyncThunk(
  "agent/getGameList",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.games.getGames();
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
