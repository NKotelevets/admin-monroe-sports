import React, { ReactElement, ReactNode, createContext, useState } from 'react'

import { TBulkEditEvent } from '@/common/types/events.ts'

interface EventBulkEditContextType {
  selectedEvents: string[] // List of selected event IDs to edit
  setSelectedEvents: (events: string[]) => void
  clearSelectedEvents: () => void
  showPreviewUpdate: boolean
  setShowPreviewUpdate: React.Dispatch<React.SetStateAction<boolean>>
  initialValues: { events: TBulkEditEvent }
  setInitialValues: (values: { events: TBulkEditEvent }) => void
}

const EventBulkEditContext = createContext<EventBulkEditContextType | undefined>(undefined)

interface EventBulkEditProviderProps {
  children: ReactNode
}

/**
 * EventBulkEditProvider is a React functional component that provides context for managing
 * bulk editing operations of events. It includes state management for selected events,
 * preview updates, and initial event values, and exposes functions to manipulate these states.
 *
 * @param {EventBulkEditProviderProps} props - The properties object containing children components.
 * @returns {ReactElement} The context provider component for bulk editing of events.
 */
export const EventBulkEditProvider: React.FC<EventBulkEditProviderProps> = ({ children }): ReactElement => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showPreviewUpdate, setShowPreviewUpdate] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<{ events: TBulkEditEvent }>({ events: {} as TBulkEditEvent })

  const clearSelectedEvents = () => {
    setSelectedEvents([])
  }

  return (
    <EventBulkEditContext.Provider
      value={{
        selectedEvents,
        setSelectedEvents,
        clearSelectedEvents,
        showPreviewUpdate,
        setShowPreviewUpdate,
        initialValues,
        setInitialValues,
      }}
    >
      {children}
    </EventBulkEditContext.Provider>
  )
}

export default EventBulkEditContext
