import { ReactElement, useEffect, useState } from 'react'
import { ScheduleContext, TScheduleDates } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { TScheduleAdditionalData } from '@/common/types'
import { useNavigate } from 'react-router-dom'
import { IScheduleRequest } from '@/common/interfaces'
import { compressData } from '@/utils'

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

  additionalData?: TScheduleAdditionalData[]
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
    pathToExport,
    additionalData
  } = props

  const navigate = useNavigate()

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

  /**
   * Removes a team from the selected list by its index.
   *
   * @param {number} index - The index of the team to remove.
   * @param {IScheduleRequest[]} data - List of Schedule Requests to filter.
   */
  const removeTeamByIndex = (index: number, data: IScheduleRequest[]): void => {
    if (additionalData) {
      const newAdditionalData = additionalData.filter((d) => d.masterTeamId !== data[index].teamId)
      const b64 = compressData(newAdditionalData)

      // setSelectedIds(newAdditionalData.map(d => d.id) || null)
      navigate(`${pathToNavigate}/${dates?.start},${dates?.end}/${b64}`)
      return
    }
  }

  const navigateWithData = (data?: TScheduleAdditionalData[], start?: string, end?: string) => {
    const b64 = compressData(data || additionalData!)
    navigate(`${pathToNavigate}/${start || dates?.start},${end || dates?.end}/${b64}`)
  }

  return (
    <ScheduleContext.Provider value={{
      dates,
      selectedIds,
      selectedTabIndex,
      pathToNavigate,
      pathToExport,
      setSelectedTabIndex,
      setDates,
      setSelectedIds,
      additionalData,
      removeTeamByIndex,
      navigateWithData
    }}>
      {children}
    </ScheduleContext.Provider>
  )
}
