import { TImportStatus } from '@/common/types'
import type { SorterResult } from 'antd/es/table/interface'
import type { GetProp, TableProps } from 'antd'
import { FormikConfig, FormikHelpers } from 'formik'
import { IUseMasterTeamExportCSVReturn } from '@/hooks/useExportScheduleCSV.ts'

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

export interface IDuplicate<T, Y> {
  idx: number
  new: T
  existing: Y
  differences?: { [key: string]: unknown } | object
}

export interface IFormProps<Body, FormValues> {
  validationSchema?: FormikConfig<FormValues>['validationSchema']
  initialValues?: FormValues
  isLoading?: boolean

  onSubmit(body: Body, formikHelpers?: FormikHelpers<FormValues>): void

  goBack(): void
}

export interface IDownloadStatus {
  message: string
  type: 'error' | 'info'
}

export interface IExportInfoProps {
  teamIds: string[]
  pathToSchedule: string
  pathToExport: string
  onExport: {
    isLoading: boolean
    status: IDownloadStatus | null
    call: IUseMasterTeamExportCSVReturn['onExport']
  }
  exportFileName?: string
  exportFileExtension?: string
}

export interface IGetScheduleRequestParams {
  start_date: string
  end_date: string
  team_ids: string
}

export interface IScheduleData {
  [key: string]: { time: string, availability: number }[]
}

export interface IScheduleRequestResponse {
  team_id: string
  team_name: string
  data: IScheduleData
}

export interface IScheduleRequest {
  teamId: string
  teamName: string
  data: IScheduleData
}

export interface IScheduleEntry {
  time: string

  [key: string]: number | string
}

export interface IDeletingError {
  id: string
  name: string
  error?: string
  status: string
}
