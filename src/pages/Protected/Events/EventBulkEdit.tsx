import { BulkEditTable } from './components/EventBuklEditForm/BulkEditTable.tsx'

import { EventBulkEditProvider } from '@/pages/Protected/Events/components/EventBuklEditForm/EventBulkEditContext.tsx'

import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'

import { Page } from '@/layouts/Page'

/**
 * EventBulkEdit is a React functional component that provides the interface for bulk editing events.
 * It utilizes context providers such as TableProvider and EventBulkEditProvider to manage state and data.
 * The component renders a page titled "Bulk Edit" and includes a BulkEditTable to display and manage editable data.
 */
const EventBulkEdit = () => {
  return (
    <TableProvider>
      <EventBulkEditProvider>
        <Page title="Bulk Edit">
          <BulkEditTable />
        </Page>
      </EventBulkEditProvider>
    </TableProvider>
  )
}

export default EventBulkEdit
