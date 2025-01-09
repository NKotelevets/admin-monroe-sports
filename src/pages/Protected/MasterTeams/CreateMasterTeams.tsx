import Breadcrumb from 'antd/es/breadcrumb'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { MonroeBlueText, PageContainer, ProtectedPageTitle } from '@/components/Elements'

import BaseLayout from '@/layouts/BaseLayout'
import { useCreateMasterTeamMutation } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'
import { MasterTeamForm } from '@/pages/Protected/MasterTeams/components/MaterTeamForm.tsx'
import { IPopulateMTRequest } from '@/common/interfaces/masterTeams.ts'
import { useNotification } from '@/hooks/useNotification.ts'

export const DEFAULT_ERROR_MESSAGE = 'Master Team could not be created. Please, try again!'
const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Create master team</MonroeBlueText> }
]

type TCreateMasterTeamProps = {
  embedded?: boolean
  goBack?(response?: string): void
  breadcrumbs?: { title: JSX.Element }[]
}

const CreateMasterTeam = (props: TCreateMasterTeamProps) => {
  const { embedded, goBack: goBackParent, breadcrumbs } = props
  const { notify } = useNotification()

  const navigation = useNavigate()
  const [createMasterTeam] = useCreateMasterTeamMutation()

  const goBack = (response?: string) => {
    if (goBackParent) {
      return goBackParent(response)
    }

    navigation(PATH_TO_MASTER_TEAMS)
  }

  const handleSubmit = (values: IPopulateMTRequest) => {
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
        goBack(response.team_id)
      })
      .catch(error => {
        notify(error?.data?.details || error?.data?.error || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  if (embedded) {
    return (
      <MasterTeamForm
        onSubmit={handleSubmit}
        goBack={goBackParent || goBack}
      />
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Create Master Team</title>
      </Helmet>

      <BaseLayout>
        <PageContainer vertical>
          <Breadcrumb items={breadcrumbs || BREAD_CRUMB_ITEMS} />
          <ProtectedPageTitle>Create Master Team</ProtectedPageTitle>
          <MasterTeamForm
            onSubmit={handleSubmit}
            goBack={goBack}
          />
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default CreateMasterTeam

