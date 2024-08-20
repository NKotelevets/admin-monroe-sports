import { PayloadAction, createSlice, isAnyOf } from '@reduxjs/toolkit'

import { authApi } from '@/redux/auth/auth.api'
import { leaguesApi } from '@/redux/leagues/leagues.api'
import { seasonsApi } from '@/redux/seasons/seasons.api'
import { userApi } from '@/redux/user/user.api'

import { IDetailedError } from '@/common/interfaces'
import { ICreateSeasonError } from '@/common/interfaces/season'

interface IInfoNotification {
  message: string
  redirectedPageUrl: string
  actionLabel: string
}

interface IAppNotification {
  message: string
  timestamp: number
  type: 'success' | 'error' | 'info'
}

interface IAppSliceState {
  notification: IAppNotification
  infoNotification: IInfoNotification
}

const EMPTY_NOTIFICATION: IAppNotification = {
  message: '',
  timestamp: 0,
  type: 'error',
}

const EMPTY_INFO_NOTIFICATION: IInfoNotification = {
  message: '',
  actionLabel: '',
  redirectedPageUrl: '',
}

const authSliceState: IAppSliceState = {
  notification: EMPTY_NOTIFICATION,
  infoNotification: EMPTY_INFO_NOTIFICATION,
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: authSliceState,
  reducers: {
    clearNotification: (state) => {
      state.notification = EMPTY_NOTIFICATION
    },
    clearInfoNotification: (state) => {
      state.infoNotification = EMPTY_INFO_NOTIFICATION
    },
    setAppNotification: (state, action: PayloadAction<IAppNotification>) => {
      state.notification = action.payload
    },
    setInfoNotification: (state, action: PayloadAction<IInfoNotification>) => {
      state.infoNotification = action.payload
    },
  },
  extraReducers: (builder) =>
    builder
      .addMatcher(userApi.endpoints.getUser.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as IDetailedError).details
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(authApi.endpoints.signIn.matchRejected, (state) => {
        state.notification.message = 'Invalid Email/Password'
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(
        isAnyOf(leaguesApi.endpoints.createLeague.matchRejected, leaguesApi.endpoints.updateLeague.matchRejected),
        (state) => {
          state.notification.message = 'Leagues/tournaments with this name already exists'
          state.notification.timestamp = new Date().getTime()
        },
      )
      .addMatcher(leaguesApi.endpoints.deleteLeague.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as IDetailedError).details
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(leaguesApi.endpoints.deleteLeague.matchFulfilled, (state) => {
        state.notification.message = 'league/tournament have been successfully removed.'
        state.notification.timestamp = new Date().getTime()
        state.notification.type = 'success'
      })
      .addMatcher(seasonsApi.endpoints.deleteSeason.matchFulfilled, (state) => {
        state.notification.message = 'season have been successfully removed.'
        state.notification.timestamp = new Date().getTime()
        state.notification.type = 'success'
      })
      .addMatcher(seasonsApi.endpoints.deleteSeason.matchRejected, (state, action) => {
        state.notification.message = (action.payload?.data as { error: string }).error
        state.notification.timestamp = new Date().getTime()
      })
      .addMatcher(
        isAnyOf(seasonsApi.endpoints.createSeason.matchRejected, seasonsApi.endpoints.updateSeason.matchRejected),
        (state, action) => {
          const details = (action.payload?.data as ICreateSeasonError).details

          state.notification.message = `
        ${details?.name ? `${details.name}` : ''} ${details.divisions?.map((division) => {
          if (division?.name && !division?.sub_division) {
            return division.name
          }

          if (division?.sub_division && !division?.name)
            return division.sub_division.map((subdivision) => subdivision.name)

          if (division?.name && division?.sub_division)
            return `${division.name}, ${division?.sub_division.map((subdivision) => subdivision.name)}`

          return ''
        })}
        `
          state.notification.timestamp = new Date().getTime()
        },
      ),
})
