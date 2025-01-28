import { ILocation } from '@/common/interfaces/location.ts'
import { TPagination } from '@/common/types/index.ts'
import { FilterValue } from 'antd/es/table/interface'

export type TLocationForm = Omit<ILocation, 'id'>

export type TListLocationRequestParams = {
  search?: string
  name?: string
  zipCode?: string
  state?: FilterValue
  city?: string
  address?: string
} & Partial<TPagination>

export type TLocationFilter = keyof TListLocationRequestParams
