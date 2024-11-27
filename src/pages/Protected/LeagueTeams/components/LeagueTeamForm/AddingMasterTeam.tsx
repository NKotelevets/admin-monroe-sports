import { useCreateMasterTeamMutation } from '@/redux/masterTeams/masterTeams.api.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { IPopulateMTRequest } from '@/common/interfaces/masterTeams.ts'
import { DEFAULT_ERROR_MESSAGE } from '@/pages/Protected/MasterTeams/CreateMasterTeams.tsx'
import { MasterTeamForm } from '@/pages/Protected/MasterTeams/components/MaterTeamForm.tsx'
import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { ILeagueForm } from '@/common/interfaces/league.ts'
import { usePageContext } from '@/layouts/Page/context.ts'

interface IAddingMasterTeam {
  setAddingMasterTeam(state: boolean): void
}

/**
 * AddingMasterTeam is a functional component that provides a form interface
 * for creating a new "Master Team" and updating the League Team form context upon successful creation.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.setAddingMasterTeam - Callback function to toggle the state of adding a new master team.
 *
 * This component:
 * - Integrates with a mutation hook (`useCreateMasterTeamMutation`) to handle the creation of a master team.
 * - Utilizes Formik's form context (`useFormikContext`) to update form fields dynamically.
 * - Provides notifications on success or error via the `useNotification` hook.
 * - Sets the page title to "Add master team" using the `usePageContext` hook.
 *
 * Features:
 * - Displays a form for creating a new master team using the `MasterTeamForm` component.
 * - On form submission, creates a new master team and updates the `masterTeam` field in the form context with the created team's ID.
 *
 * @returns {React.Element} Rendered form UI for adding a new master team.
 */
export const AddingMasterTeam = ({ setAddingMasterTeam }: IAddingMasterTeam): ReactElement => {
  const [createMasterTeam] = useCreateMasterTeamMutation()
  const { setFieldValue } = useFormikContext<ILeagueForm>()
  const { notify } = useNotification()
  const { setPageTitle } = usePageContext()

  useEffect(() => {
    setPageTitle('Add master team')
  }, [])

  const onSubmit = (values: IPopulateMTRequest) => {
    createMasterTeam({
      name: values.name,
      head_coach: values.head_coach,
      coaches: values.coaches,
      players: values.players,
      team_admins: values.team_admins
    })
      .unwrap()
      .then((response) => {
        notify(`Master Team "${values.name}" was created`, 'success')
        setAddingMasterTeam(false)
        setFieldValue('masterTeam',response?.team_id || undefined)
      })
      .catch(error => {
        notify(error?.data?.error || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }
  return (
    <MasterTeamForm onSubmit={onSubmit} goBack={() => setAddingMasterTeam(false)} />
  )
}
