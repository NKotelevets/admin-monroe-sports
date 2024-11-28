import { Page } from '@/layouts/Page'
import { LeagueTeamForm } from './components/LeagueTeamForm'
import { useCreateLeagueTeamMutation } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { ILeagueForm } from '@/common/interfaces/league.ts'
import { ICreateLeagueTeamRequest } from '@/common/interfaces/leagueTeams.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useNavigate } from 'react-router-dom'
import { PATH_TO_LEAGUE_TEAMS } from '@/common/constants/paths.ts'
import { ReactElement } from 'react'

const DEFAULT_ERROR_MESSAGE = `Something went wrong. Please, try again!`

/**
 * League Team Create Page
 *
 * A page component for creating a new league team. It renders a form for entering league team details,
 * validates the input, and handles the creation process by interacting with an API.
 *
 * Features:
 * - Submits form data to the `createLeagueTeam` API.
 * - Notifies the user of success or error through a notification system.
 * - Navigates back to the league teams listing page upon successful creation.
 *
 * @component
 * @returns {ReactElement} The rendered page with the league team creation form.
 *
 * Functionality:
 * - `onSubmit`: Handles form submission, calls the API to create a new league team, and provides user feedback.
 *   - On success: Notifies the user and navigates to the league teams page.
 *   - On error: Displays an error notification with details from the API or a default message.
 *
 * Example:
 * ```tsx
 * import LeagueTeamCreate from './LeagueTeamCreate';
 *
 * const App = () => <LeagueTeamCreate />;
 * ```
 *
 */
const LeagueTeamCreate = (): ReactElement => {
  const navigate = useNavigate()
  const { notify } = useNotification()

  const [createLeagueTeam, {isLoading}] = useCreateLeagueTeamMutation()

  const goBack = () => navigate(PATH_TO_LEAGUE_TEAMS)

  const onSubmit = (body: ILeagueForm) => {
    createLeagueTeam(body as ICreateLeagueTeamRequest)
      .unwrap()
      .then(() => {
        notify('League team was successfully created', 'success')
        goBack()
      })
      .catch((error) => {
        notify(error?.data?.error || error?.data?.details || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  return (
    <Page title="Create league team">
      <LeagueTeamForm
        isLoading={isLoading}
        onSubmit={onSubmit}
        goBack={goBack}
      />
    </Page>
  )
}

export default LeagueTeamCreate
