import { useContext } from 'react'
import { EventFormContext } from '../components/EventForm/EventFormContext'

export const useEventFormContext = () => {
  const context = useContext(EventFormContext)

  if (!context) {
    throw new Error('useEventFormContext must be used inside a EventFormContext!')
  }

  return context
}
