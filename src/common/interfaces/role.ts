import { IIdName } from '@/common/interfaces'
import { TRole } from '@/common/types'
import { ISelectedTeams } from '@/common/interfaces/user.ts'

export interface IFERole {
  name: TRole | string
  linkedEntities?: IIdName[] | ISelectedTeams[]
}

