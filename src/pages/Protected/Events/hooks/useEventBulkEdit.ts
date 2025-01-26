import EventBulkEditContext from '../components/EventBuklEditForm/EventBulkEditContext.tsx'
import { useContext } from 'react'

export const useEventBulkEdit = () => {
  const context = useContext(EventBulkEditContext)

  if (!context) {
    throw new Error('useEventBulkEdit must be used within an EventBulkEditProvider.')
  }

  return context
}
