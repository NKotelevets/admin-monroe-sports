import * as Yup from 'yup'

export type TMasterTeamRole = 'admin' | 'coach' | 'head-coach' | 'player'

export interface IMasterTeamRole {
  fullName: string
  id: string
  email: string
  role: TMasterTeamRole
}

export interface IPopulateMasterTeam {
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

export const initialCreateMasterTeamValues: IPopulateMasterTeam = {
  name: '',
  coaches: [getInitialEntity('head-coach')],
  players: [],
  teamAdministrators: [getInitialEntity('admin')],
}

const masterTeamRoleValidationSchema = Yup.object<IPopulateMasterTeam>().shape({
  fullName: Yup.string().required(),
  id: Yup.string().required(),
  email: Yup.string().required(),
  role: Yup.string().required(),
})

export const masterTeamsValidationSchema = Yup.object<IPopulateMasterTeam>().shape({
  name: Yup.string().required('Name is required'),
  teamAdministrators: Yup.array(masterTeamRoleValidationSchema).min(1, 'Error message'),
  coaches: Yup.array(masterTeamRoleValidationSchema).min(1, 'Error message'),
  players: Yup.array(),
})

