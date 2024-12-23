import { IRole } from '@/common/interfaces/user.ts'
import { TableProps } from 'antd/es/table/InternalTable'
import { Dayjs } from 'dayjs'
import { ReactElement } from 'react'

export type TDeleteStatus = 'red' | 'green' | 'yellow'

export type TImportStatus = 'loading' | TDeleteStatus

export type TErrorDuplicate = 'Duplicate' | 'Error'

export type TSortOption = 'descend' | 'ascend' | null

export type TGender = 0 | 1 | 2

export type TRole = 'Coach' | 'Head Coach' | 'Player' | 'Team Admin' | 'Operator' | 'Master Admin'

export type NestedObject = Record<string, unknown> | Array<NestedObject>

export type IUserBulkEditPayload = {
  id: string
  roles?: IRole[]
  is_active?: boolean
}

export type TColumns<T> = TableProps<T>['columns']

export type TRangePickerValue = [start: Dayjs | null | undefined, end: Dayjs | null | undefined]

export type IBreadcrumbs = { title: ReactElement }[] | undefined

export type TScheduleAdditionalData = {
  id: string
  name: string
  masterTeamName?: string
  masterTeamId?: string
  leagueName?: string
}
