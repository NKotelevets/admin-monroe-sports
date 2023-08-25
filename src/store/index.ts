import { configureStore, combineReducers } from "@reduxjs/toolkit";

import games from "./reducers/games";

const rootReducer = combineReducers({
  games,
});

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.REACT_APP_CUSTOM_NODE_ENV !== "production",
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
