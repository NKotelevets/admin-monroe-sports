import { IFENew, IRole } from '@/common/interfaces/user.ts'

export type TNewUser = Omit<IFENew, 'roles'> & { roles: (IRole & { team: string })[] }
export type TNewUserRoles = (IRole & { teamName: string })[]
export type TLinkedRole = IRole & { teamName: string, teamNames?: string[] }
