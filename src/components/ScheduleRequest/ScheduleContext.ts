import { createContext } from 'react'

/**
 * Represents a type for schedule dates, which can be a pair of start and end dates or null.
 */
export type TScheduleDates = { start: string, end: string } | null

/**
 * Defines the structure of the ScheduleRequestProps, which is used to manage and manipulate
 * schedule-related data within a context. It includes the dates, selected IDs, selected tab index,
 * and a path to navigate, along with methods to update these values.
 */
export interface IScheduleRequestProps {
  /**
   * The start and end dates for the schedule, or null if not set.
   */
  dates: { start: string, end: string } | null

  /**
   * The list of selected IDs, or null if no IDs are selected.
   */
  selectedIds: string[] | null

  /**
   * The index of the currently selected tab.
   */
  selectedTabIndex: number

  /**
   * The path to show schedule on the browser
   */
  pathToNavigate: string

  /**
   * The api endpoint to export the schedule
   */
  pathToExport: string

  /**
   * A function to set the schedule dates (start and end).
   * @param dates - The start and end dates or null to clear the schedule.
   */
  setDates(dates: TScheduleDates): void

  /**
   * A function to set the selected IDs.
   * @param ids - An array of selected IDs or null to clear the selection.
   */
  setSelectedIds(ids: string[] | null): void

  /**
   * A function to set the selected tab index.
   * @param index - The index of the selected tab.
   */
  setSelectedTabIndex(index: number): void
}

/**
 * Context for managing schedule-related state across the application.
 * Provides the schedule dates, selected IDs, selected tab index, and the path to navigate,
 * along with functions to update these values.
 */
export const ScheduleContext = createContext<IScheduleRequestProps>({} as IScheduleRequestProps)
