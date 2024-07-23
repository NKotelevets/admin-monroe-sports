import { seasonsApi } from '@/redux/seasons/seasons.api'
import { seasonsSlice } from '@/redux/seasons/seasons.slice'

export const seasonsReducer = {
  [seasonsApi.reducerPath]: seasonsApi.reducer,
  [seasonsSlice.name]: seasonsSlice.reducer,
}

