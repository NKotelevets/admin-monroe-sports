import { Table } from 'antd'
import { ReactElement, useState } from 'react'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useUsersImportInfoTableParams } from '@/pages/Protected/Users/hooks/useUsersImportInfoTableParams.tsx'
import { UserImportDuplicateModal } from '@/pages/Protected/Users/components/UserImportDuplicateModal.tsx'

/**
 * UserImportTable Component
 *
 * This component renders a table for managing user data imported from a CSV, providing features to handle duplicates.
 *
 * @returns {ReactElement} A JSX element consisting of:
 * - A `Table` component that displays imported user records.
 * - A `UserImportDuplicateModal` modal that is shown when a duplicate entry is selected.
 *
 * @description
 * - Uses the `useUserSlice` hook to fetch imported records, handle duplicate entries, and provide a mechanism to remove duplicates.
 * - Utilizes the `useUsersImportInfoTableParams` hook to configure table columns and parameters, as well as to manage changes in the table state.
 * - Maintains the state `selectedIndex` to track which record is currently selected for duplicate resolution.
 *
 * @state
 * - `selectedIndex`: Tracks the index of the currently selected user record for duplicate handling, or `null` if no record is selected.
 *
 * @modals
 * - Displays `UserImportDuplicateModal` when `selectedIndex` is not `null`, allowing users to review and manage duplicate entries.
 *
 * @table
 * - Configures the `Table` component with dynamic columns and records.
 * - `pagination` and `onChange` are managed through `tableParams` and `handleTableChange` to provide smooth data handling and table updates.
 */
export const UserImportTable = (): ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const {
    importCSVTableRecords: records,
    duplicates,
    removeDuplicate
  } = useUserSlice()

  const {
    columns,
    tableParams,
    handleTableChange
  } = useUsersImportInfoTableParams({
    setSelectedIndex,
    records
  })

  return (
    <>
      {selectedIndex !== null && (
        <UserImportDuplicateModal
          duplicates={duplicates}
          removeDuplicate={removeDuplicate}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.idx}
        dataSource={records}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </>
  )
}
