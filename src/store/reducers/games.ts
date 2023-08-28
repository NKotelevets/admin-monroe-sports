import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getGameList } from "../asyncActions/games";

import { createTypedSelector } from "../utils";

interface GamesReducerI {
  isLoadingGame: boolean;
}

const initialState: GamesReducerI = {
  isLoadingGame: false,
};

export const getGameListSelector = createTypedSelector((state) => []);

const gamesSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setIsLoaderGame: (state, action: PayloadAction<boolean>) => {
      state.isLoadingGame = action.payload;
    },
  },
  extraReducers: {
    [getGameList.pending.type]: (state) => {
      state.isLoadingGame = true;
    },
    [getGameList.fulfilled.type]: (state) => {
      state.isLoadingGame = false;
    },
    [getGameList.rejected.type]: (state) => {
      state.isLoadingGame = false;
    },
  },
});

export const { setIsLoaderGame } = gamesSlice.actions;

export default gamesSlice.reducer;
