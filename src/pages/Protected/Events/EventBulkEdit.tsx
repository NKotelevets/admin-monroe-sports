import { Page } from '@/layouts/Page'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { BulkEditTable } from './components/BulkEditTable'


const EventBulkEdit = () => {
  return (
    <TableProvider>
      <Page
        title="Bulk Edit"
      >
        <BulkEditTable />
      </Page>
    </TableProvider>
  )
}

export default EventBulkEdit
