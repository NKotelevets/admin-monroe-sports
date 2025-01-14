import * as Yup from 'yup'

import { BEST_RECORD_WINS, WINNING } from '@/common/constants/league'
import { IBracket } from '@/common/interfaces/bracket'
import { FormikErrors, FormikTouched } from 'formik'

export const participantSchema = Yup.object().shape({
  id: Yup.string(),
  isEmpty: Yup.boolean(),
  subDivision: Yup.string().when('isEmpty', {
    is: (value: boolean) => !value,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  seed: Yup.number()
    .nullable()
    .when('isEmpty', {
      is: (value: boolean) => !value,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.optional(),
    }),
})

export const matchSchema = Yup.object({
  id: Yup.number().nullable(),
  nextMatchId: Yup.number().nullable(),
  tournamentRoundText: Yup.string().nullable(),
  state: Yup.string().required(),
  isNotFirstRound: Yup.boolean(),
  gameNumber: Yup.mixed().nullable(),
  startTime: Yup.string().required(),
  topTeam: Yup.string(),
  bottomTeam: Yup.string(),
  matchParticipants: Yup.array().of(participantSchema).required(),
})

export const bracketSchema = Yup.object({
  name: Yup.string(),
  subdivisionsNames: Yup.array(Yup.string()).min(1),
  playoffTeams: Yup.number().integer(),
  matches: Yup.array().of(matchSchema).min(1),
})

const subdivisionValidationSchema = Yup.object().shape({
  name: Yup.string().required('Subdivision/subpool name is required'),
  description: Yup.string(),
  standingsFormat: Yup.string(),
  tiebreakersFormat: Yup.string(),
})

export const divisionValidationSchema = Yup.object<ICreateSeasonDivision[]>().shape({
  name: Yup.string().required('Division Name is required'),
  description: Yup.string(),
  playoffFormat: Yup.string(),
  subDivisions: Yup.array()
    .of(subdivisionValidationSchema)
    .test('unique-names', 'Subdivision names must be unique', (items) => {
      if (!items) return true // Return true if the array is empty or undefined

      const names = items.map((item) => item.name)
      const uniqueNames = new Set(names)

      return names.length === uniqueNames.size // Validate uniqueness
    })
    .required(),
  brackets: Yup.array()
    .of(bracketSchema)
})

export const seasonValidationSchema = Yup.object<ICreateSeasonFormValues>().shape({
  name: Yup.string().required('Name is required'),
  league: Yup.string().required('Linked League/Tourn is required'),
  startDate: Yup.string().required('Start Date is required'),
  expectedEndDate: Yup.string().required('Expected End Date is required'),
  divisions: Yup.array()
    .of(divisionValidationSchema)
    .test('unique-names', 'Names must be unique', (items) => {
      if (!items) return true // Return true if the array is empty or undefined

      const names = items.map((item) => item.name)
      const uniqueNames = new Set(names)

      return names.length === uniqueNames.size // Validate uniqueness
    })
    .required(),
})

export const INITIAL_SUBDIVISION_DATA = {
  id: '',
  name: '',
  description: '',
  playoffFormat: BEST_RECORD_WINS,
  standingsFormat: WINNING,
  tiebreakersFormat: WINNING,
  brackets: [],
}

export const INITIAL_DIVISION_DATA = {
  id: '',
  name: '',
  description: '',
  subDivisions: [INITIAL_SUBDIVISION_DATA],
}

export const seasonInitialFormValues: ICreateSeasonFormValues = {
  name: '',
  league: undefined,
  startDate: null,
  expectedEndDate: null,
  divisions: [
    {
      name: '',
      description: '',
      playoffFormat: BEST_RECORD_WINS,
      brackets: [],
      subDivisions: [
        {
          name: '',
          description: '',
          standingsFormat: WINNING,
          tiebreakersFormat: WINNING,
          changed: false,
        },
      ],
    },
  ],
}

export interface ICreateSeasonSubdivision {
  id?: string
  name: string
  description: string
  standingsFormat: string
  tiebreakersFormat: string
  changed: boolean
}

export interface ICreateSeasonDivision {
  id?: string
  name: string
  description: string
  playoffFormat: string
  brackets: IBracket[]
  subDivisions: ICreateSeasonSubdivision[]
}

export interface ICreateSeasonFormValues {
  name: string
  league?: string
  startDate: string | null
  expectedEndDate: string | null
  divisions: ICreateSeasonDivision[]
}

export interface IDivisionFormik {
  values?: ICreateSeasonDivision;
  touched?: FormikTouched<ICreateSeasonDivision>; // Nested touched object
  errors?: FormikErrors<ICreateSeasonDivision>;   // Nested error object
}
