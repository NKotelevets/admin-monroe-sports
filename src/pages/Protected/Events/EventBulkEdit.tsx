import { BulkEditTable } from './components/EventBuklEditForm/BulkEditTable.tsx'

import { EventBulkEditProvider } from '@/pages/Protected/Events/components/EventBuklEditForm/EventBulkEditContext.tsx'

import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'

import { Page } from '@/layouts/Page'

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
