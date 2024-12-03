import { createContext } from 'react'

export type TScheduleDates = { start: string, end: string } | null

export interface IScheduleRequestProps {
  dates: { start: string, end: string } | null
  selectedIds: string[] | null
  selectedTabIndex: number
  pathToNavigate: string

  setDates(dates: TScheduleDates): void

  setSelectedIds(ids: string[] | null): void

  setSelectedTabIndex(index: number): void
}

export const ScheduleContext = createContext<IScheduleRequestProps>({} as IScheduleRequestProps)
