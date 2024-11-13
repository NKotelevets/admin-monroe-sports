import { ReactElement } from 'react'
import { MonroeBlueText } from '@/components/Elements'
import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { MasterTeamImportTable } from './components/MasterTeamImportTable'
import { Page } from '@/layouts/Page.tsx'

const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Import info</MonroeBlueText> }
]

const PAGE_SUBTITLE = `This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
  duplicate to review details, compare and decide whether to keep existing records or replace them with new
  entries. This helps ensure your data is accurate and up-to-date.`


const MasterTeamImportInfo = (): ReactElement => {
  return (
    <TableProvider>
      <Page
        title="League Teams"
        subtitle={PAGE_SUBTITLE}
        breadcrumbs={BREADCRUMB_ITEMS}
      >
        <MasterTeamImportTable />
      </Page>
    </TableProvider>
  )
}

export default MasterTeamImportInfo
