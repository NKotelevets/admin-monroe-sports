import { bindActionCreators } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { useAppSelector } from '@/redux/hooks'
import { seasonsSlice } from '@/redux/seasons/seasons.slice'

export const useSeasonSlice = () => {
  const dispatch = useDispatch()
  const seasonsState = useAppSelector((state) => state.seasonsSlice)
  const seasonsActions = bindActionCreators(seasonsSlice.actions, dispatch)

  return {
    ...seasonsState,
    ...seasonsActions,
  }
}
