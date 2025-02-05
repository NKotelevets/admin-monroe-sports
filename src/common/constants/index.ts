import { TGender, TRole } from '@/common/types'

export const APP_URL = 'https://swiftschedule.page.link/?link=https://app.swiftschedule.net/'
export const APP_STORE_URL = 'https://app.swiftschedule.net/ios'
export const PLAY_STORE_URL = 'https://app.swiftschedule.net/android'

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
export const PARENT_ROLE = 'Guardian'
export const CHILD_ROLE = 'Child'
export const HEAD_COACH_ROLE = 'Head Coach'
export const TEAM_ADMIN_ROLE = 'Team Admin'
export const PLAYER_ROLE = 'Player'
export const COACH_ROLE = 'Coach'

export const ROLES_WITH_TEAMS: TRole[] = [HEAD_COACH_ROLE, COACH_ROLE, PLAYER_ROLE, TEAM_ADMIN_ROLE]

export const DEFAULT_ERROR_MESSAGE = `Something went wrong. Please, try again!`

export const INVITE_TYPE = [0, 1, 2, 3, 4, 5, 6, 7, 8]
export const INVITE_TYPE_NAMED = {
  COACH: INVITE_TYPE[0],
  PLAYER: INVITE_TYPE[1],
  SUPERVISOR: INVITE_TYPE[2],
  SUPERVISED: INVITE_TYPE[3],
  VIEWER: INVITE_TYPE[4],
  OPERATOR: INVITE_TYPE[5],
  HEAD_COACH: INVITE_TYPE[6],
  TEAM_ADMIN: INVITE_TYPE[7],
  MASTER_ADMIN: INVITE_TYPE[8],
}

export const EMPTY_VALUE = '---'
