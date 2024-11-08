import { LeagueTeamsTable } from './components/LeagueTeamsTable'
import { TableProvider } from '@/components/Table/MonroeTable/TableProvider.tsx'
import { TablePage } from '@/layouts/TablePage'

const DELETE_TERMS = {
  singular: 'league team',
  plural: 'league teams'
}

const LeagueTeams = () => {
  return (
    <TableProvider>
      <TablePage
        title="League Teams"
        onCreate={alert}
        onDelete={alert}
        deleteTerm={DELETE_TERMS}
      >
        <LeagueTeamsTable />
      </TablePage>
    </TableProvider>
  )
}

export default LeagueTeams
