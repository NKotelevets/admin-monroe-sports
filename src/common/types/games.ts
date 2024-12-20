import { IPaginationResponse } from '@/common/interfaces/api.ts'
import { NestedSnakeCase } from '@/common/types/index.ts'
import { IEvent } from '@/common/interfaces/event.ts'

export type TPaginatedEvents = IPaginationResponse<NestedSnakeCase<IEvent>[]>

export type TListEventRequestParams = {
  court?: string
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
