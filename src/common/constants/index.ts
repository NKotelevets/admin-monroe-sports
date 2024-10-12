import { TGender } from '@/common/types'

export const SHORT_GENDER_NAMES: Record<TGender, string> = {
  '0': 'F',
  '1': 'M',
  '2': '-',
}

export const FULL_GENDER_NAMES: Record<TGender, string> = {
  '0': 'Female',
  '1': 'Male',
  '2': 'Other',
}

export const OPERATOR_ROLE = 'Operator'
export const MASTER_ADMIN_ROLE = 'Master Admin'
export const PARENT_ROLE = 'Parent'
export const CHILD_ROLE = 'Child'
export const HEAD_COACH_ROLE = 'Head Coach'

