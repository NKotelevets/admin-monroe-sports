import { TRole } from '@/common/types'

export interface IFERole {
  name: TRole | string
  linkedEntities?: { id: string; name: string }[]
}

