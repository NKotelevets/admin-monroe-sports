import * as Yup from 'yup'

import { IFEUser } from '@/common/interfaces/user'

export type TMasterTeamRole = 'admin' | 'coach' | 'head-coach' | 'player'

export interface IMasterTeamRole {
  firstName: string
  lastName: string
  email: string
  role: TMasterTeamRole
}

export interface ICreateMasterTeam {
  name: string
  teamAdministrators: IMasterTeamRole[]
  coaches: IMasterTeamRole[]
  players: IFEUser[]
}

export const getInitialEntity = (entityRole: TMasterTeamRole): IMasterTeamRole => ({
  email: '',
  firstName: '',
  lastName: '',
  role: entityRole,
})

export const initialCreateMasterTeamValues: ICreateMasterTeam = {
  name: '',
  coaches: [getInitialEntity('head-coach')],
  players: [],
  teamAdministrators: [getInitialEntity('admin')],
}

const masterTeamRoleValidationSchema = Yup.object<ICreateMasterTeam>().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().required(),
  role: Yup.string().required(),
})

export const masterTeamsValidationSchema = Yup.object<ICreateMasterTeam>().shape({
  name: Yup.string().required('Name is required'),
  teamAdministrators: Yup.array(masterTeamRoleValidationSchema).min(1, 'Error message'),
  coaches: Yup.array(masterTeamRoleValidationSchema).min(1, 'Error message'),
  players: Yup.array(),
})

