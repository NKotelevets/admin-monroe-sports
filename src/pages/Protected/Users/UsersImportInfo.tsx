import { ReactElement } from 'react'

import { MonroeBlueText } from '@/components/Elements'

import { PATH_TO_USERS } from '@/common/constants/paths'
import { Page } from '@/layouts/Page.tsx'
import { UserImportTable } from '@/pages/Protected/Users/UserImportTable.tsx'

const PAGE_SUBTITLE = `This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
duplicate to review details, compare and decide whether to keep existing records or replace them with new
entries. This helps ensure your data is accurate and up-to-date.
`
const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_USERS}>Users</a> },
  { title: <MonroeBlueText>Import info</MonroeBlueText> }
]

/**
 * The `UsersImportInfo` page displays a list of imported user records (from a CSV file)
 * and highlights duplicate or erroneous records found during the import process.
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
 */
const UsersImportInfo = (): ReactElement => {
  return (
    <Page
      title="Import info"
      subtitle={PAGE_SUBTITLE}
      breadcrumbs={BREADCRUMB_ITEMS}
    >
      <UserImportTable />
    </Page>
  )
}

export default UsersImportInfo

