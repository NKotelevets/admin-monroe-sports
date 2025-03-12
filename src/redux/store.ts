import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import { appSlice } from '@/redux/app/app.slice'
import { authApi } from '@/redux/auth/auth.api'
import { authReducer } from '@/redux/auth/auth.reducer'
import { eventsApi } from '@/redux/events/events.api.ts'
import { leaguesApi } from '@/redux/leagues/leagues.api'
import { leaguesReducer } from '@/redux/leagues/leagues.reducer'
import { masterTeamsApi } from '@/redux/masterTeams/masterTeams.api'
import { masterTeamsReducer } from '@/redux/masterTeams/masterTeams.reducer'
import { seasonsApi } from '@/redux/seasons/seasons.api'
import { seasonsReducer } from '@/redux/seasons/seasons.reducer'
import { userApi } from '@/redux/user/user.api'
import { userReducer } from '@/redux/user/user.reducer'
import { leagueTeamsReducer } from '@/redux/leagueTeams/leagueTeams.reducer.ts'
import { leagueTeamsApi } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { eventsReducer } from '@/redux/events/events.reducer.ts'
import { locationsReducer } from '@/redux/locations/locations.reducer.ts'
import { locationsApi } from '@/redux/locations/locations.api.ts'
import { accountApi } from '@/redux/account/account.api.ts'
import { accountReducer } from '@/redux/account/account.reducer.ts'

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

const getPanelKey = () => {
  if (typeof window === 'undefined') return 'root'
  return window.location.pathname.includes('/accounts') ? 'root_onboarding' : 'root'
}

const persistConfig = {
  key: getPanelKey(),
  version: 1,
  storage,
  whitelist: ['authSlice', 'userSlice', 'leaguesSlice', 'seasonsSlice', 'appSlice', 'masterTeamsSlice', 'leagueTeamsSlice', 'eventsSlice',],
}

const rootReducer = combineReducers({
  ...authReducer,
  ...userReducer,
  ...leaguesReducer,
  ...seasonsReducer,
  ...masterTeamsReducer,
  ...leagueTeamsReducer,
  ...eventsReducer,
  ...locationsReducer,
  ...accountReducer,
  [appSlice.name]: appSlice.reducer,
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
    }).concat([
      authApi.middleware,
      userApi.middleware,
      leaguesApi.middleware,
      seasonsApi.middleware,
      masterTeamsApi.middleware,
      leagueTeamsApi.middleware,
      eventsApi.middleware,
      locationsApi.middleware,
      accountApi.middleware,
    ]),
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch

export const persistor = persistStore(store)

export default store
