import { bindActionCreators } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { eventsSlice } from '@/redux/events/events.slice'

export const useEventsSlice = () => {
  const state = useAppSelector((state) => state.eventsSlice)
  const dispatch = useAppDispatch()
  const actions = bindActionCreators(eventsSlice.actions, dispatch)

  return {
    ...state,
    ...actions,
  }
}

