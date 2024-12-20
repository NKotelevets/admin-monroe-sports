import { eventsSlice } from '@/redux/events/events.slice.tsx'
import { eventsApi } from '@/redux/events/events.api.ts'

export const eventsReducer = {
  [eventsSlice.name]: eventsSlice.reducer,
  [eventsApi.reducerPath]: eventsApi.reducer,
}

