import { LeagueTeamsTable } from './components/LeagueTeamsTable'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { TablePage } from '@/layouts/TablePage'
import { ReactElement } from 'react'

const DELETE_TERMS = {
  singular: 'league team',
  plural: 'league teams'
}

/**
 * LeagueTeams Page
 *
 * This component sets up a page for managing "league teams" using a table layout.
 * It utilizes the `TableProvider` to supply context to the `TablePage` and `LeagueTeamsTable`,
 * providing features such as item selection, loading states, and handling table parameters.
 *
 * The `TablePage` handles the main layout, including create and delete actions,
 * and uses the `DELETE_TERMS` object to specify the singular and plural terms for deletion prompts.
 *
 * @constant {Object} DELETE_TERMS
 * - Defines the terms for the deletion modal:
 *   - `singular`: A string representing the singular form ("league team").
 *   - `plural`: A string representing the plural form ("league teams").
 *
 * @component
 * @returns {ReactElement} The LeagueTeams page component.
 */
const LeagueTeams = (): ReactElement => {
  return (
    <TableProvider>
      <TablePage
        title="League Teams"
        onCreate={() => undefined}
        onDelete={() => undefined}
        deleteTerm={DELETE_TERMS}
      >
        <LeagueTeamsTable />
      </TablePage>
    </TableProvider>
  )
}

export default LeagueTeams
