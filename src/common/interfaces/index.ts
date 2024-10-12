import { TImportStatus } from '@/common/types'

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
