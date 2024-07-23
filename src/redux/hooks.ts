import type { TAppDispatch, TRootState } from '@/redux/store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch<TAppDispatch>()
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector

