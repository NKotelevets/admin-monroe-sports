import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { TRootState } from '@/redux/store.ts'

import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'
import { TPrefilledDataWithToken } from '@/common/types/users.ts'

interface InvitationState {
  status:
    | 'idle'
    | 'requestLogin'
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
}

const initialState: InvitationState = {
  status: 'idle',
  token: undefined,
  invitation: undefined,
  user: undefined,
}

// ✅ Move store-dependent logic to an async thunk
export const receiveInvitationThunk = createAsyncThunk(
  'accountSlice/receiveInvitation',
  async (payload: Partial<TPrefilledDataWithToken>, { getState }) => {
    const state = getState() as TRootState

    if (!payload.invitation) {
      return {
        status: 'expired',
        payload
      }
    }

    if (payload.userData?.isNewUser) {
      return {
        status: 'createPassword',
        payload
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
    setConfirmData: (state) => {
      state.status = 'confirmData'
    },
    setConfirmParentData: (state) => {
      state.status = 'confirmParentData'
    },
    setPending: (state) => {
      state.status = 'pending'
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
