import * as Yup from 'yup'

import { IFECreateLeagueBody } from '@/common/interfaces/league'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.number().required('Type is required'),
  description: Yup.string(),
  welcomeNote: Yup.string(),
  playoffFormat: Yup.number().required('Default Playoff Format is required'),
  standingsFormat: Yup.number().required('Default Standings Format is required'),
  tiebreakersFormat: Yup.number().required('Default Tiebreakers Format is required'),
  playoffsTeams: Yup.number(),
})

export const initialFormValues: IFECreateLeagueBody = {
  description: '',
  welcomeNote: '',
  name: '',
  type: 0,
  playoffFormat: 0,
  standingsFormat: 0,
  tiebreakersFormat: 0,
  playoffsTeams: 4,
}
