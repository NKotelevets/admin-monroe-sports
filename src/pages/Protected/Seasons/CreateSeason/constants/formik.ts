import * as Yup from 'yup'

import { IFEDivision } from '@/common/interfaces/division'
import { IFECreateSeason } from '@/common/interfaces/season'

const subdivisionValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  playoffFormat: Yup.string().required('Playoff format is required'),
  standingsFormat: Yup.string().required('Standings format is required'),
  tiebreakersFormat: Yup.string().required('Tiebreakers format is required'),
})

const divisionValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  subdivisions: Yup.array().of(subdivisionValidationSchema),
})

export const seasonValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  league: Yup.string().required('Linked League/Tourn is required'),
  startDate: Yup.string().required('Start Date is required'),
  expectedEndDate: Yup.string()
    .required('Expected End Date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  divisions: Yup.array(divisionValidationSchema).of(
    subdivisionValidationSchema
  ),
})

export const INITIAL_DIVISION_DATA: IFEDivision = {
  name: '',
  description: '',
  subDivision: [
    {
      description: '',
      name: '',
      playoffFormat: 'Best Record Wins',
      standingsFormat: 'Winning %',
      tiebreakersFormat: 'Winning %',
    },
  ],
}

export const seasonInitialFormValues: IFECreateSeason = {
  name: '',
  league: '',
  startDate: '',
  expectedEndDate: '',
  divisions: [INITIAL_DIVISION_DATA],
}
