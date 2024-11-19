import { Page } from '@/layouts/Page.tsx'
import { LeagueTeamForm } from './components/LeagueTeamForm'

const LeagueTeamCreate = () => {
  return (
    <Page title="Create league team">
      <LeagueTeamForm
        initialValues={undefined}
        validationSchema={undefined}
        onSubmit={() => undefined}
        goBack={() => undefined}
      />
    </Page>
  )
}

export default LeagueTeamCreate
