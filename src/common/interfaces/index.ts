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
  status: 'loading' | 'red' | 'green' | 'yellow'
  isOpen: boolean
}

export interface IGetEntityResponse<T> {
  count: number
  data: T[]
}
