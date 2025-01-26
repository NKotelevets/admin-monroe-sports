import React, { ReactNode, createContext, useState } from 'react'

interface EventBulkEditContextType {
  selectedEvents: string[] // List of selected event IDs to edit
  setSelectedEvents: (events: string[]) => void
  clearSelectedEvents: () => void
}

const EventBulkEditContext = createContext<EventBulkEditContextType | undefined>(undefined)

interface EventBulkEditProviderProps {
  children: ReactNode
}

export const EventBulkEditProvider: React.FC<EventBulkEditProviderProps> = ({ children }) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const clearSelectedEvents = () => {
    setSelectedEvents([])
  }

  return (
    <EventBulkEditContext.Provider
      value={{
        selectedEvents,
        setSelectedEvents,
        clearSelectedEvents,
      }}
    >
      {children}
    </EventBulkEditContext.Provider>
  )
}

export default EventBulkEditContext
