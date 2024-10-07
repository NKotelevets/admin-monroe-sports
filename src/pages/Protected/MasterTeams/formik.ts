import * as Yup from 'yup'

export type TMasterTeamRole = 'admin' | 'coach' | 'head-coach' | 'player'

export interface IMasterTeamRole {
  fullName: string
  id: string
  email: string
  role: TMasterTeamRole
}

export interface ICreateMasterTeam {
  name: string
  teamAdministrators: IMasterTeamRole[]
  coaches: IMasterTeamRole[]
  players: { id: string; name: string }[]
}

export const getInitialEntity = (entityRole: TMasterTeamRole): IMasterTeamRole => ({
  email: '',
  fullName: '',
  id: '',
  role: entityRole,
})

export const initialCreateMasterTeamValues: ICreateMasterTeam = {
  name: '',
  coaches: [getInitialEntity('head-coach')],
  players: [],
  teamAdministrators: [getInitialEntity('admin')],
}

const masterTeamRoleValidationSchema = Yup.object<ICreateMasterTeam>().shape({
  fullName: Yup.string().required(),
  id: Yup.string().required(),
  email: Yup.string().required(),
  role: Yup.string().required(),
})

export const masterTeamsValidationSchema = Yup.object<ICreateMasterTeam>().shape({
  name: Yup.string().required('Name is required'),
  teamAdministrators: Yup.array(masterTeamRoleValidationSchema).min(1, 'Error message'),
  coaches: Yup.array(masterTeamRoleValidationSchema).min(1, 'Error message'),
  players: Yup.array(),
})

