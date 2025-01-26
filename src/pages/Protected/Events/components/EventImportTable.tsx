import { useEventImportInfoTableParams } from '../hooks/useEventImportTableParams.tsx'
import { Table } from 'antd'
import { ReactElement } from 'react'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

/**
 * Event Import Table
 *
 * Component renders a table for managing duplicate imported Events.
 * Displays the name and status (duplicate or error) of each record, and provides
 * controls for reviewing and updating duplicate entries using a modal.
 *
 * @returns {ReactElement} The rendered table component with modal handling for duplicates.
 */
export const EventImportTable = (): ReactElement => {
  const { importCSVTableRecords } = useEventsSlice()
  const { columns } = useEventImportInfoTableParams()

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record) => record.index || Math.random()}
        dataSource={importCSVTableRecords}
        pagination={undefined}
        onChange={undefined}
        scroll={{
          x: 'max-content'
        }}
      />
    </>
  )
}
