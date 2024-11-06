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

const DEFAULT_ERROR_MESSAGE = 'Master Team could not be created. Please, try again!'
const BREAD_CRUMB_ITEMS = [
  { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
  { title: <MonroeBlueText>Create master team</MonroeBlueText> }
]

const CreateMasterTeam = () => {
  const navigation = useNavigate()
  const { notify } = useNotification()
  const [createMasterTeam] = useCreateMasterTeamMutation()

  const goBack = () => navigation(PATH_TO_MASTER_TEAMS)

  const handleSubmit = (values: IPopulateMTRequest) => {
    createMasterTeam({
      name: values.name,
      head_coach: values.head_coach,
      coaches: values.coaches,
      players: values.players,
      team_admins: values.team_admins
    })
      .unwrap()
      .then(() => {
        notify(`Master Team "${values.name}" was created`, 'success')
        goBack()
      })
      .catch(error => {
        notify(error?.data?.error || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Create Master Team</title>
      </Helmet>

      <BaseLayout>
        <PageContainer vertical>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />
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

