import { FilterValue } from 'antd/es/table/interface'

import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { IEvent } from '@/common/interfaces/event'
import { ILocation } from '@/common/interfaces/location.ts'
import { NestedSnakeCase, TDeleteStatus, TPagination } from '@/common/types/index.ts'


export type TPaginatedEvents = IPaginationResponse<NestedSnakeCase<IEvent>[]>

export type TListEventRequestParams = {
  court?: string
  courtOrField?: string
  date?: FilterValue
  day?: FilterValue
  leagueName?: string
  limit?: number
  offset?: number
  ordering?: string
  search?: string
  subResource?: string

  homeTeam?: string
  team1name?: string
  team1Season?: string
  team1HeadCoach?: string

  awayTeam?: string
  team2Name?: string
  team2Season?: string
  team2HeadCoach?: string

  type?: FilterValue
  repeats?: FilterValue
  location?: string
  locationName?: string
}

export type TEventFilter = keyof TListEventRequestParams

export type TListLocationResponse = {
  results: ILocation[]
} & TPagination

export type TEventCreationPayload = {
  event_type: number
  event_description: string
  event_subscribers: string
  date: string
  day: string
  time: string
  location_id: string
  court_or_field: string
  sub_resource: string
  ignore_conflicts: boolean
  team_1_id: string
  team_2_id: string
  duration: number
}

export type TEventEditingPayload = {
  id: string
  event_type?: number
  event_description?: string
  event_subscribers?: string
  date?: string
  day?: string
  time?: string
  location_id?: string
  court_or_field?: string
  sub_resource?: string
  ignore_conflicts?: boolean
  team_1_id?: string
  team_2_id?: string
  duration?: number
}

export type TEventBulkEditPayload = {
  id: string
  day: string
  date: string
  time: string
  duration: number
  location_id: string
  court_or_field: string
  sub_resource: string
  description: string
  team_1_id: string
  team_2_id: string
}

export type TEventConflictError = {
  conflicts?: { title: string; details: string }[]
}

export type TBulkEditEvent = Record<string, IEvent & { locationId: string; team1Id?: string; team2Id?: string }>
export type TBulkEditEventForm = { events: TBulkEditEvent }

export type TEventImport = {
  status: string
  index: number
  error: string
  row: {
    status: string
    Date: string | null
    'Start Time': string | null
    'Duration (in minutes)': number | null
    Location: string | null
    'Zip Code': string | null
    'Court/Field': string | null
    'Sub Resource': string | null
    'Event Type': string | null
    'Event Description': string | null
    'Team 1 Name': string | null
    'Team 1 League': string | null
    'Team 1 Season': string | null
    'Team 2 Name': string | null
    'Team 2 League': string | null
    'Team 2 Season': string | null
  }
}
export type TEventImportResponse = {
  status: TDeleteStatus
  success: unknown[]
  errors: TEventImport[]
}

export type TEventImportErrors = {
  index: number
  status: string
  error: string
  date: string
  time: string
  duration: number
  location: string
  zipCode: string | null
  courtOrField: string | null
  subResources: string | null
  type: string | null
  eventDescription: string | null
  team1Name: string | null
  team1League: string | null
  team1Season: string | null
  team2Name: string | null
  team2League: string | null
  team2Season: string | null
}

export type TEventImportTable = {
  status: TDeleteStatus
  success: IEvent[]
  errors: TEventImportErrors[]
}
