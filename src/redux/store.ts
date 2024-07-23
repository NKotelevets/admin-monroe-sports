import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import { appSlice } from '@/redux/app/app.slice'
import { authApi } from '@/redux/auth/auth.api'
import { authReducer } from '@/redux/auth/auth.reducer'
import { leaguesApi } from '@/redux/leagues/leagues.api'
import { leaguesReducer } from '@/redux/leagues/leagues.reducer'
import { seasonsApi } from '@/redux/seasons/seasons.api'
import { seasonsReducer } from '@/redux/seasons/seasons.reducer'
import { userApi } from '@/redux/user/user.api'
import { userReducer } from '@/redux/user/user.reducer'

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null)
    },
    setItem(_: unknown, value: unknown) {
      return Promise.resolve(value)
    },
    removeItem() {
      return Promise.resolve()
    },
  }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['authSlice', 'appSlice', 'userSlice', 'leaguesSlice', 'seasonsSlice'],
}

const rootReducer = combineReducers({
  ...authReducer,
  ...userReducer,
  ...leaguesReducer,
  ...seasonsReducer,
  [appSlice.reducerPath]: appSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, REGISTER],
      },
    }).concat([authApi.middleware, userApi.middleware, leaguesApi.middleware, seasonsApi.middleware]),
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export const persistor = persistStore(store)

export default store
