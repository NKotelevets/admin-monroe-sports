import { ReactElement, useEffect, useState } from 'react'
import { ScheduleContext, TScheduleDates } from '@/components/ScheduleRequest/ScheduleContext.ts'

/**
 * Props interface for the ScheduleProvider component.
 * It defines the initial values for schedule dates, selected IDs, the selected tab index,
 * and the path for navigation, as well as the children component(s) to be rendered.
 */
interface IScheduleProviderProps {
  /**
   * The initial dates to be set in the schedule provider, or null if no initial dates.
   * This should be an array with two date strings: [start, end].
   */
  initialDates: string[] | null

  /**
   * The initial selected IDs, or null if no initial selection.
   */
  initialSelectedIds: string[] | null

  /**
   * The initial index of the selected tab (default is 0).
   */
  initialIndex?: number

  /**
   * The child component(s) to be rendered inside the provider.
   */
  children: ReactElement

  /**
   * The path to show schedule on the browser
   */
  pathToNavigate: string

  /**
   * The api endpoint to export schedule requests
   */
  pathToExport: string
}

/**
 * Provides schedule-related context state for the application, including the selected dates,
 * selected IDs, and the selected tab index. It also manages the logic for updating these values
 * based on initial props and triggers updates when the `initialDates` or `initialSelectedIds`
 * change (e.g., due to URL updates).
 *
 * The provider ensures that child components can consume and modify schedule-related state
 * via the `ScheduleContext`.
 *
 * @param {IScheduleProviderProps} props - The properties for initializing the schedule context.
 *
 * @returns {ReactElement} The children components wrapped by the context provider.
 */
export const ScheduleProvider = (props: IScheduleProviderProps): ReactElement => {
  const {
    initialDates,
    initialSelectedIds,
    children,
    initialIndex = 0,
    pathToNavigate,
    pathToExport
  } = props

  const [selectedTabIndex, setSelectedTabIndex] = useState(initialIndex)
  const [dates, setDates] = useState<TScheduleDates>(null)
  const [selectedIds, setSelectedIds] = useState<string[] | null>(initialSelectedIds)

  // Sets initial date based on initialDates prop.
  useEffect(() => {
    if (!initialDates || initialDates.length < 1) return
    setDates({ start: initialDates[0], end: initialDates[1] } || null)
  }, [initialDates])

  // Updates selected IDs when initialSelectedIds prop changes (e.g., URL updates).
  useEffect(() => {
    if (initialSelectedIds !== selectedIds) {
      setSelectedIds(initialSelectedIds)
    }
  }, [initialSelectedIds])

  return (
    <ScheduleContext.Provider value={{
      dates,
      selectedIds,
      selectedTabIndex,
      pathToNavigate,
      pathToExport,
      setSelectedTabIndex,
      setDates,
      setSelectedIds
    }}>
      {children}
    </ScheduleContext.Provider>
  )
}
