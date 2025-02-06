import { EventBulkEditButton } from './EventBulkEditButton'
import { EventImportCsvButton } from '@/pages/Protected/Events/components/EventImportCsvButton.tsx'

export const EventTableControls = () => {

  return (
    <>
      <EventBulkEditButton />
      <EventImportCsvButton />
    </>
  )
}
