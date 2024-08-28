import * as Yup from 'yup'

import { IMatch } from '@/common/interfaces/bracket'

export const participantSchema = Yup.object().shape({
  id: Yup.string(),
  isEmpty: Yup.boolean(),
  subpoolName: Yup.string().when('isEmpty', {
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
  participants: Yup.array().of(participantSchema).required(),
})

export const bracketSchema = Yup.object({
  name: Yup.string(),
  subdivisionsNames: Yup.array(Yup.string()).min(1),
  playoffTeams: Yup.number().integer(),
  matches: Yup.array().of(matchSchema).min(1),
})

const subdivisionValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string(),
  playoffFormat: Yup.string(),
  standingsFormat: Yup.string(),
  tiebreakersFormat: Yup.string(),
  brackets: Yup.array()
    .of(bracketSchema)
    .when('playoffFormat', {
      is: (value: string) => value === 'Single Elimination Bracket',
      then: (schema) => schema.required().min(1),
    }),
})

const divisionValidationSchema = Yup.object<ICreateSeasonDivision[]>().shape({
  name: Yup.string().required(''),
  description: Yup.string(),
  subdivisions: Yup.array().of(subdivisionValidationSchema).required(),
})

export const seasonValidationSchema = Yup.object<ICreateSeasonFormValues>().shape({
  name: Yup.string().required(),
  league: Yup.string().required(),
  startDate: Yup.string().required(),
  expectedEndDate: Yup.string().required(),
  divisions: Yup.array().of(divisionValidationSchema).required(),
})

export const INITIAL_SUBDIVISION_DATA = {
  name: '',
  description: '',
  playoffFormat: 'Best Record Wins',
  standingsFormat: 'Winning %',
  tiebreakersFormat: 'Winning %',
  brackets: [],
}

export const INITIAL_DIVISION_DATA = {
  name: '',
  description: '',
  subdivisions: [INITIAL_SUBDIVISION_DATA],
}

export const seasonInitialFormValues: ICreateSeasonFormValues = {
  name: '',
  league: '',
  startDate: null,
  expectedEndDate: null,
  divisions: [
    {
      name: '',
      description: '',
      subdivisions: [
        {
          name: '',
          description: '',
          playoffFormat: 'Best Record Wins',
          standingsFormat: 'Winning %',
          tiebreakersFormat: 'Winning %',
          brackets: [],
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
  playoffFormat: string
  standingsFormat: string
  tiebreakersFormat: string
  changed: boolean
  brackets: {
    id?: number
    name: string
    subdivisionsNames: string[]
    playoffTeams: number
    matches: IMatch[]
  }[]
}

export interface ICreateSeasonDivision {
  id?: string
  name: string
  description: string
  subdivisions: ICreateSeasonSubdivision[]
}

export interface ICreateSeasonFormValues {
  name: string
  league: string
  startDate: string | null
  expectedEndDate: string | null
  divisions: ICreateSeasonDivision[]
}