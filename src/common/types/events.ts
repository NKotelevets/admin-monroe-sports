import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { NestedSnakeCase, TPagination } from '@/common/types/index.ts'
import { IEvent } from '@/common/interfaces/event.ts'
import { ILocation } from '@/common/interfaces/location.ts'

export type TPaginatedEvents = IPaginationResponse<NestedSnakeCase<IEvent>[]>

export type TListEventRequestParams = {
  court?: string
  date?: string
  day?: string
  leagueName?: string
  limit?: number
  offset?: number
  ordering?: string
  search?: string
  subResource?: string
  team1Name?: string
  team2Name?: string
  type?: string
  repeats?: string
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
  sub_resources?: string
  ignore_conflicts?: boolean
  team_1_id?: string
  team_2_id?: string
  duration?: number
}
