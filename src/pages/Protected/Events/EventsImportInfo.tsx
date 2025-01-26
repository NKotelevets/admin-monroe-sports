import { ReactElement } from 'react'
import { MonroeBlueText } from '@/components/Elements'
import { PATH_TO_EVENTS } from '@/common/constants/paths'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { EventImportTable } from './components/EventImportTable'
import { Page } from '@/layouts/Page'

const BREADCRUMB_ITEMS = [
  { title: <a href={PATH_TO_EVENTS}>Events</a> },
  { title: <MonroeBlueText>Import info</MonroeBlueText> }
]

const PAGE_SUBTITLE = `This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
  duplicate to review details, compare and decide whether to keep existing records or replace them with new
  entries. This helps ensure your data is accurate and up-to-date.`

/**
 * Master Team Import Info Page
 *
 * This component renders the "Events" page, which provides an overview of the CSV import process,
 * highlighting rows with errors and duplicates for review and action.
 *
 * @returns {ReactElement} A React element that renders the "Events" page with a table displaying import details.
 *
 * @description
 * - The `Page` component sets up the main structure of the page, including:
 *   - `title`: The title of the page, "Events."
 *   - `subtitle`: A detailed description of the import panel's purpose, set by `PAGE_SUBTITLE`.
 *   - `breadcrumbs`: Navigation breadcrumbs defined by `BREADCRUMB_ITEMS` to help users track their location.
 * - The `EventImportTable` component is rendered within the page to display the team import information.
 */
const EventImportInfo = (): ReactElement => {
  return (
    <TableProvider>
      <Page
        title="Import Info"
        subtitle={PAGE_SUBTITLE}
        breadcrumbs={BREADCRUMB_ITEMS}
      >
        <EventImportTable />
      </Page>
    </TableProvider>
  )
}

export default EventImportInfo
