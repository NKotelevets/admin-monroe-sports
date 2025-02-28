import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { TPrefilledDataWithToken } from '@/common/types/users.ts'
import { IFEUser, IInvitation } from '@/common/interfaces/user.ts'
import store from '@/redux/store.ts'

interface InvitationState {
  status: 'idle' | 'requestLogin' | 'createPassword' | 'confirmData' | 'confirmParentData' | 'under16' | 'pending' | 'accepted' | 'rejected' | 'expired' | 'error'
  token: string | null
  invitation: IInvitation | null
  user: IFEUser | null
}

const initialState: InvitationState = {
  status: 'idle',
  token: null,
  invitation: null,
  user: null,
}

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
        return
      }

      if(!store.getState().authSlice?.access) {
        state.status = 'requestLogin'
        return
      }

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
})
