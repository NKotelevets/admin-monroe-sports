import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

import { setIsUpdatedTokens, setRedirectToLogin, updateTokens } from '@/redux/auth/auth.slice'
import { TRootState } from '@/redux/store'

import { ISignInResponse } from '@/common/interfaces/auth'

const mutex = new Mutex()
const baseUrl = import.meta.env.VITE_BACKEND_URL
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, api) => {
    const state = api.getState() as TRootState
    headers.set('authorization', `Bearer ${state.authSlice.access}`)
    return headers
  },
})

const baseQueryWithReAuth: BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)
  const state = api.getState() as unknown as TRootState

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await fetch(baseUrl + '/users/login/refresh-token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: state.authSlice.refresh,
          }),
        })
        const tokens: ISignInResponse = await refreshResult.json()

        if (tokens.access) {
          api.dispatch(setRedirectToLogin(false))
          api.dispatch(updateTokens(tokens))
          api.dispatch(setIsUpdatedTokens(true))

          result = await baseQuery(
            {
              ...args,
              headers: {
                ...args.headers,
                authorization: `Bearer ${tokens.access}`,
              },
            },
            api,
            extraOptions,
          )
        } else {
          api.dispatch(setRedirectToLogin(true))
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export default baseQueryWithReAuth

