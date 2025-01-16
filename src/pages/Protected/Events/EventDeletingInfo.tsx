import { MonroeBlueText } from '@/components/Elements'
import { PATH_TO_EVENTS } from '@/common/constants/paths'
import DeletingInfoPage from '@/layouts/DeletingInfoPage.tsx'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_EVENTS}>Events</a> },
  { title: <MonroeBlueText>Deleting info</MonroeBlueText> }
]

/**
 * EventDeletingInfo Page
 *
 * This component renders a page that provides an overview of events that could not be deleted due to errors.
 * It displays a table summarizing the records with deletion issues, allowing users to navigate to specific team details
 * and address the errors.
 *
 * Returns:
 * - A `Page` component containing a `Table` that lists event deletion errors.
 *
 * Example:
 * ```jsx
 * <EventDeletingInfo />
 * ```
 */
const EventDeletingInfo = () => {
  const { deletedRecordsErrors } = useEventsSlice()

  return (
    <DeletingInfoPage
      title="Deleting info"
      subtitle="This panel provides a summary of deleted events, listing the rows with errors. Click on the event name to view the
          details and correct the error that is preventing deletion."
      breadcrumbs={BREADCRUMB_ITEMS}
      dataSource={deletedRecordsErrors}
      objectColumnTitle="Event Name"
      pathToObject={PATH_TO_EVENTS}
    />
  )
}

export default EventDeletingInfo
