import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { accountApi } from '@/redux/account/account.api.ts'
import { TRootState } from '@/redux/store.ts'

import { INVITE_TYPE_NAMED } from '@/common/constants'
import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'
import { TChildData, TPrefilledDataWithToken } from '@/common/types/users.ts'

type TUpdatedUserData = Pick<
  TPrefilledDataWithToken['userData'],
  'firstName' | 'lastName' | 'gender' | 'birthDate' | 'zipCode'
>

interface InvitationState {
  status:
    | 'idle'
    | 'requestLogin'
    | 'signUp'
    | 'createPassword'
    | 'confirmData'
    | 'confirmParentData'
    | 'under16'
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'expired'
    | 'error'
  token?: string
  invitation?: IInvitation
  user?: IFEUser
  tempPassword?: string
  updatedUserData?: TUpdatedUserData
  childData?: TChildData
}

const initialState: InvitationState = {
  status: 'idle',
  token: undefined,
  invitation: undefined,
  user: undefined,
  tempPassword: undefined,
  updatedUserData: undefined,
  childData: undefined,
}

// ✅ Move store-dependent logic to an async thunk
export const receiveInvitationThunk = createAsyncThunk(
  'accountSlice/receiveInvitation',
  async (payload: Partial<TPrefilledDataWithToken>, { getState }) => {
    const state = getState() as TRootState

    if (state.accountSlice?.status === 'signUp') {
      return {
        status: 'signUp',
        payload,
      }
    }

    if (state.accountSlice?.status === 'accepted') {
      return {
        status: 'accepted',
        payload,
      }
    }

    if (state.accountSlice?.status === 'rejected') {
      return {
        status: 'rejected',
        payload,
      }
    }

    if (!payload.invitation) {
      return {
        status: 'expired',
        payload,
      }
    }

    if (
      payload.userData?.isNewUser &&
      (!payload.userData.isChild || payload.invitation.inviteType == INVITE_TYPE_NAMED.SUPERVISED)
    ) {
      return {
        status: 'createPassword',
        payload,
      }
    }

    if (
      payload.userData?.isNewUser && payload.userData.hasGuardian
    ) {
      return {
        status: 'createPassword',
        payload,
      }
    }

    if (payload.userData?.isNewUser && payload.userData.isChild && !payload.userData.hasGuardian) {
      return {
        status: 'under16',
        payload,
      }
    }

    if (!state.authSlice?.access) {
      return { status: 'requestLogin', payload }
    } else {
      return { status: 'pending', payload }
    }
  },
)

export const accountSlice = createSlice({
  name: 'accountSlice',
  initialState: initialState,
  reducers: {
    receiveInvitation: (state, action: PayloadAction<TPrefilledDataWithToken>) => {
      state.token = action.payload.token
      state.user = action.payload.userData
      state.invitation = action.payload.invitation

      if (state.user.isNewUser) {
        state.status = 'createPassword'
      } else {
        state.status = 'requestLogin'
      }

      // if (!store.getState().authSlice?.access) {
      //   state.status = 'requestLogin'
      //   return
      // }
    },
    setInvitationStatus: (state, action: PayloadAction<InvitationState['status']>) => {
      state.status = action.payload
    },
    setConfirmData: (state, action: PayloadAction<{ callback(x: boolean): void; params?: boolean }>) => {
      state.status = 'confirmData'
      const _params = action.payload.params === undefined ? true : action.payload.params
      action.payload.callback(_params)
    },
    setConfirmParentData: (state) => {
      state.status = 'confirmParentData'
    },
    setPending: (state, action: PayloadAction<{ callback(x: boolean): void; params?: boolean }>) => {
      state.status = 'pending'
      const _params = action.payload.params === undefined ? true : action.payload.params
      action.payload.callback(_params)
    },
    setCreatePassword: (state, action: PayloadAction<{ callback(x: boolean): void; params?: boolean }>) => {
      state.status = 'createPassword'
      const _params = action.payload.params === undefined ? true : action.payload.params
      action.payload.callback(_params)
    },
    setSignUp: (state, action: PayloadAction<{ callback(x: boolean): void; params?: boolean }>) => {
      state.status = 'signUp'
      const _params = action.payload.params === undefined ? true : action.payload.params
      action.payload.callback(_params)
    },
    setUnder16: (state) => {
      state.status = 'under16'
    },
    setAccepted: (state) => {
      state.status = 'accepted'
    },
    setDenied: (state) => {
      state.status = 'rejected'
    },
    setExpired: (state) => {
      state.status = 'expired'
    },
    setError: (state) => {
      state.status = 'error'
    },
    resetInvitation: () => initialState, // Resets state if user closes the window
    setUserData: (state, action: PayloadAction<TUpdatedUserData & { dateOfBirth?: string }>) => {
      const { birthDate, dateOfBirth, ...rest } = action.payload || { birthDate: undefined, dateOfBirth: undefined }
      let value = { ...rest, birthDate }

      if (birthDate) {
        value = { ...value, birthDate }
      }
      if (dateOfBirth) {
        value = { ...value, birthDate: dateOfBirth }
      }

      state.updatedUserData = value
    },
    setChildData: (state, action: PayloadAction<TChildData>) => {
      state.childData = action.payload
    },
    setTempPassword: (state, action: PayloadAction<string>) => {
      state.tempPassword = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(receiveInvitationThunk.fulfilled, (state, action) => {
      state.token = action.payload.payload.token
      state.user = action.payload.payload.userData
      state.invitation = action.payload.payload.invitation
      state.status = action.payload.status as InvitationState['status']
    })
    builder.addMatcher(accountApi.endpoints.getPrefilledData.matchFulfilled, (state, action) => {
      if (action.payload?.userData && action.payload?.invitation) {
        state.user = action.payload.userData
        state.invitation = action.payload.invitation
      }
    })
  },
})
