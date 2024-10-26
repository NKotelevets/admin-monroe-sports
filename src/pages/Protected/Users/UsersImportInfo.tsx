import { Table } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { ReactElement, useState } from 'react'

import UsersReviewUpdateModal from '@/pages/Protected/Users/components/UsersReviewUpdateModal'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'
import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'

import { PATH_TO_USERS } from '@/common/constants/paths'
import { useUsersImportInfoTableParams } from '@/pages/Protected/Users/hooks/useUsersImportInfoTableParams.tsx'

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_USERS}>Users</a>,
  },
  {
    title: <MonroeBlueText>Import info</MonroeBlueText>,
  },
]

/**
 * The `UsersImportInfo` page displays a list of imported user records (from a CSV file)
 * and highlights duplicate or erroneous records found during the import process.
 * This component utilizes the custom `useUsersImportInfoTableParams` hook to manage table state
 * and configurations, providing a user-friendly overview of the data.
 *
 * ## Features:
 * - Renders a table with imported user records.
 * - Flags duplicate entries and errors within the dataset.
 * - Let users review and update the records they choose.
 *
 * @component
 *
 * @example
 * // Example usage in a parent component
 * <UsersImportInfo />
 *
 * @returns {ReactElement} A table view of the imported users, with duplicate and error flags.
 *
 * Dependencies:
 * - Ant Design's `Table` component for data rendering.
 * - `useUsersImportInfoTableParams` custom hook to manage table parameters and configurations.
 */
const UsersImportInfo = (): ReactElement => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const { importCSVTableRecords } = useUserSlice()
  const {
    columns,
    tableParams,
    handleTableChange
  } = useUsersImportInfoTableParams({
    setSelectedIdx,
    records: importCSVTableRecords
  })

  return (
    <>
      {selectedIdx !== null && <UsersReviewUpdateModal idx={selectedIdx} onClose={() => setSelectedIdx(null)} />}

      <BaseLayout>
        <Container>
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          <Title>Import info</Title>

          <Description>
            This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
            duplicate to review details, compare and decide whether to keep existing records or replace them with new
            entries. This helps ensure your data is accurate and up-to-date.
          </Description>

          <Table
            columns={columns}
            rowKey={(record) => record.idx}
            dataSource={importCSVTableRecords}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Container>
      </BaseLayout>
    </>
  )
}

export default UsersImportInfo

