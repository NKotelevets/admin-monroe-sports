import { ReactElement, useEffect, useState } from 'react'
import { ScheduleContext, TScheduleDates } from '@/components/ScheduleRequest/ScheduleContext.ts'

interface IScheduleProviderProps {
  initialDates: string[] | null
  initialSelectedIds: string[] | null
  initialIndex?: number
  children: ReactElement
  pathToNavigate: string
}

export const ScheduleProvider = (props: IScheduleProviderProps) => {
  const {
    initialDates,
    initialSelectedIds,
    children,
    initialIndex = 0,
    pathToNavigate
  } = props

  const [selectedTabIndex, setSelectedTabIndex] = useState(initialIndex)
  const [dates, setDates] = useState<TScheduleDates>(null)
  const [selectedIds, setSelectedIds] = useState<string[] | null>(initialSelectedIds)

  // Sets initial date
  useEffect(() => {
    if (!initialDates || initialDates.length < 1) return
    setDates({ start: initialDates[0], end: initialDates[1] } || null)
  }, [initialDates])

  // update ids when initial values changes (url changed)
  useEffect(() => {
    if(initialSelectedIds !== selectedIds) {
      setSelectedIds(initialSelectedIds)
    }
  }, [initialSelectedIds])

  return (
    <ScheduleContext.Provider value={{
      dates,
      selectedIds,
      selectedTabIndex,
      setSelectedTabIndex,
      setDates,
      setSelectedIds,
      pathToNavigate
    }}>
      {children}
    </ScheduleContext.Provider>
  )
}
