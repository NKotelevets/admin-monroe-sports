import { FilterValue } from 'antd/es/table/interface'

import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { IEvent } from '@/common/interfaces/event'
import { ILocation } from '@/common/interfaces/location.ts'
import { NestedSnakeCase, TPagination } from '@/common/types/index.ts'

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

export type TListLocationRequest = {
  search?: string
} & Partial<TPagination>

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
