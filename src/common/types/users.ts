import { IFENew, IPrefilledUserData, IRole } from '@/common/interfaces/user.ts'

export type TNewUser = Omit<IFENew, 'roles'> & { roles: (IRole & { team: string })[] }
export type TNewUserRoles = (IRole & { teamName: string })[]
export type TLinkedRole = IRole & { teamName: string, teamNames?: string[] }

export type TPrefilledDataWithToken = IPrefilledUserData & { token: string }

export type TChildData = {
  firstName: string
  lastName: string
  birthDate: string
  suffix: string
  email: string
}
