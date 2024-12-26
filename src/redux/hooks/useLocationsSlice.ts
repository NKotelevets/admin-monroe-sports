import { bindActionCreators } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { locationsSlice } from '@/redux/locations/locations.slice.tsx'

export const useLocationsSlice = () => {
  const state = useAppSelector((state) => state.locationsSlice)
  const dispatch = useAppDispatch()
  const actions = bindActionCreators(locationsSlice.actions, dispatch)

  return {
    ...state,
    ...actions,
  }
}

