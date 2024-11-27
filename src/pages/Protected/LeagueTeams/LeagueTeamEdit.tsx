import { Page } from '@/layouts/Page'
import { LeagueTeamForm } from './components/LeagueTeamForm'
import { useEditLeagueTeamMutation, useGetLeagueTeamQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { ILeagueForm } from '@/common/interfaces/league.ts'
import { ICreateLeagueTeamRequest } from '@/common/interfaces/leagueTeams.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { PATH_TO_LEAGUE_TEAMS } from '@/common/constants/paths.ts'
import { ReactElement, useEffect } from 'react'
import { MonroeBlueText } from '@/components/Elements'
import Loader from '@/components/Loader.tsx'

const DEFAULT_ERROR_MESSAGE = `Something went wrong. Please, try again!`

/**
 * League Team Edit Page
 *
 * A page component for editing a new league team. It renders a form for entering league team details,
 * validates the input, and handles the editing process by interacting with an API.
 *
 * Features:
 * - Submits form data to the `editLeagueTeam` API.
 * - Notifies the user of success or error through a notification system.
 * - Navigates back to the league teams listing page upon successful update.
 *
 * @component
 * @returns {ReactElement} The rendered page with the league team editing form.
 *
 * Functionality:
 * - `onSubmit`: Handles form submission, calls the API to updates a new league team, and provides user feedback.
 *   - On success: Notifies the user and navigates to the league teams page.
 *   - On error: Displays an error notification with details from the API or a default message.
 *
 * Example:
 * ```tsx
 * import LeagueTeamEdit from './LeagueTeamEdit';
 *
 * const App = () => <LeagueTeamEdit />;
 * ```
 *
 */
const LeagueTeamEdit = (): ReactElement => {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { notify } = useNotification()

  const [editLeagueTeam] = useEditLeagueTeamMutation()
  const { data, isLoading, isError } = useGetLeagueTeamQuery(
    { id: params?.id || '' },
    { skip: !params?.id }
  )

  // could not find or load master team
  useEffect(() => {
    isError && goBack()
  }, [isError])

  const goBack = () => navigate(PATH_TO_LEAGUE_TEAMS)

  if (!data || isLoading || isError) return <Loader />

  const onSubmit = (body: ILeagueForm) => {
    editLeagueTeam({
      id: data?.id,
      body: body as ICreateLeagueTeamRequest
    })
      .unwrap()
      .then(() => {
        notify('League team was successfully created', 'success')
        goBack()
      })
      .catch((error) => {
        notify(error?.data?.error || error?.data?.details || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  const BREAD_CRUMB_ITEMS = [
    { title: <a href={PATH_TO_LEAGUE_TEAMS}>Master Teams</a> },
    { title: <MonroeBlueText>{data?.name}</MonroeBlueText> }
  ]

  const initialValues: ILeagueForm = {
    name: data.name,
    masterTeam: data?.masterTeam ? data.masterTeam.id : undefined,
    masterTeamAdminName: data?.masterTeam ? data.masterTeam.teamAdmin?.firstName || '' : '',
    masterTeamAdminEmail: data?.masterTeam ? data.masterTeam.teamAdmin?.email : '',
    league: data.league?.id || undefined,
    division: data.division?.id || undefined,
    subdivision: data.subdivision?.id || undefined,
    masterTeamAdmin: undefined
  }
  
  return (
    <Page
      title="Edit league team"
      breadcrumbs={BREAD_CRUMB_ITEMS}
    >
      <LeagueTeamForm
        initialValues={initialValues}
        isLoading={isLoading}
        onSubmit={onSubmit}
        goBack={goBack}
      />
    </Page>
  )
}

export default LeagueTeamEdit
