import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { NestedSnakeCase, TPagination } from '@/common/types/index.ts'
import { IEvent, ILocation } from '@/common/interfaces/event.ts'

export type TPaginatedEvents = IPaginationResponse<NestedSnakeCase<IEvent>[]>

export type TListEventRequestParams = {
  court?: string
  date?: string
  leagueName?: string
  limit?: number
  offset?: number
  ordering?: string
  search?: string
  subResource?: string
  team1Name?: string
  team2Name?: string
}

export type TEventFilter = keyof TListEventRequestParams

export type TListLocationRequest = {
  search?: string
} & Partial<TPagination>

export type TListLocationResponse = {
  results: ILocation[]
} & TPagination
