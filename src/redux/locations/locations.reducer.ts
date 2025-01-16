import { locationsSlice } from '@/redux/locations/locations.slice.tsx'
import { locationsApi } from '@/redux/locations/locations.api.ts'

export const locationsReducer = {
  [locationsSlice.name]: locationsSlice.reducer,
  [locationsApi.reducerPath]: locationsApi.reducer
}

