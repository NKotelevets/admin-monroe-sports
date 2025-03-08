import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { TRootState } from '@/redux/store.ts'

import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'
import { TPrefilledDataWithToken } from '@/common/types/users.ts'

type TUpdatedUserData = Pick<
  TPrefilledDataWithToken['userData'],
  'firstName' | 'lastName' | 'gender' | 'birthDate' | 'zipCode'
>
type TChildData = {
  firstName: string
  lastName: string
  dateOfBirth: string
  suffix: string
  email: string
}

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

    if (!payload.invitation) {
      return {
        status: 'expired',
        payload,
      }
    }

    if (payload.userData?.isNewUser && payload.userData.isChild) {
      return {
        status: 'createPassword',
        payload,
      }
    }

    if (payload.userData?.isNewUser && !payload.userData.isChild) {
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
    setRejected: (state) => {
      state.status = 'rejected'
    },
    setExpired: (state) => {
      state.status = 'expired'
    },
    setError: (state) => {
      state.status = 'error'
    },
    resetInvitation: () => initialState, // Resets state if user closes the window
    setUserData: (state, action: PayloadAction<TUpdatedUserData>) => {
      state.updatedUserData = action.payload
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
  },
})
