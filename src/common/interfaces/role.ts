import { IIdName } from '@/common/interfaces'
import { TRole } from '@/common/types'

export interface IFERole {
  name: TRole | string
  linkedEntities?: IIdName[]
}

