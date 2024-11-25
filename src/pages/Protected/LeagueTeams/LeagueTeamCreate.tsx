import { Page } from '@/layouts/Page.tsx'
import { LeagueTeamForm } from './components/LeagueTeamForm'
import { useCreateLeagueTeamMutation } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { ILeagueForm } from '@/common/interfaces/league.ts'
import { ICreateLeagueTeamRequest } from '@/common/interfaces/leagueTeams.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_LEAGUE_TEAMS } from '@/common/constants/paths.ts'

const DEFAULT_ERROR_MESSAGE = `Something went wrong. Please, try again!`

const LeagueTeamCreate = () => {
  const navigate = useNavigate()
  const { notify } = useNotification()

  const [createLeagueTeam] = useCreateLeagueTeamMutation()

  const onSubmit = (body: ILeagueForm) => {
    createLeagueTeam(body as ICreateLeagueTeamRequest)
      .unwrap()
      .then(() => {
        notify('League team was successfully created', 'success')
        navigate(PATH_TO_LEAGUE_TEAMS)
      })
      .catch((error) => {
        notify(error?.data?.error || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  return (
    <Page title="Create league team">
      <LeagueTeamForm
        initialValues={undefined}
        validationSchema={undefined}
        onSubmit={onSubmit}
        goBack={() => undefined}
      />
    </Page>
  )
}

export default LeagueTeamCreate
