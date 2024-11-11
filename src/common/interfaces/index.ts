import { TImportStatus } from '@/common/types'
import type { SorterResult } from 'antd/es/table/interface'
import type { GetProp, TableProps } from 'antd'

export interface IDetailedError {
  code: string
  details: string
}

export interface INamedDetailsError {
  code: string
  details: {
    name: string[]
  }
}

export interface IIdName {
  id: string
  name: string
}

export interface IImportModalOptions {
  filename: string
  errorMessage?: string
  status: TImportStatus
  isOpen: boolean
}

export interface IGetEntityResponse<T> {
  count: number
  data: T[]
}

export interface IAdditionalEmail {
  email: string
  is_verified: boolean
}

export interface IAdditionalPhone {
  phone_number: string
  is_verified: boolean
}

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
export interface ITableParams<T> {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<T>['field']
  sortOrder?: SorterResult<T>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}
