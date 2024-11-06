import Breadcrumb from 'antd/es/breadcrumb'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { IPopulateMasterTeam, masterTeamsValidationSchema, TMasterTeamRole } from '@/pages/Protected/MasterTeams/formik'

import { MonroeBlueText, PageContainer, ProtectedPageTitle } from '@/components/Elements'
import Loader from '@/components/Loader'

import BaseLayout from '@/layouts/BaseLayout'
import { useEditMasterTeamMutation, useGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'

import { useNotification } from '@/hooks/useNotification.ts'
import { MasterTeamForm } from '@/pages/Protected/MasterTeams/components/MaterTeamForm.tsx'
import { IPopulateMTRequest } from '@/common/interfaces/masterTeams.ts'
import { useEffect } from 'react'

const DEFAULT_ERROR_MESSAGE = `Master Team could not be updated. Please, try again!`

const EditMasterTeam = () => {
  const params = useParams<{ id: string }>()
  const { notify } = useNotification()
  const navigation = useNavigate()

  const [editMT] = useEditMasterTeamMutation()

  const { data, isLoading, isError } = useGetMasterTeamQuery(
    { id: params?.id || '' },
    { skip: !params.id }
  )

  const goBack = () => navigation(PATH_TO_MASTER_TEAMS)

  // could not find or load master team
  useEffect(() => {
    isError && goBack()
  }, [isError])

  const handleSubmit = (values: IPopulateMTRequest) => {
    editMT({
      id: params!.id as string,
      body: values
    })
      .unwrap()
      .then(() => {
        notify('Master Team was successfully edited', 'success')
        goBack()
      })
      .catch((error) => {
        notify(error?.data?.error || DEFAULT_ERROR_MESSAGE, 'error')
      })
  }

  if (!data && isLoading) return <Loader />

  const BREAD_CRUMB_ITEMS = [
    { title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a> },
    { title: <MonroeBlueText>{data!.name}</MonroeBlueText> }
  ]

  const initialData: IPopulateMasterTeam = {
    name: data!.name,
    coaches: [
      {
        ...data!.headCoach,
        role: 'head-coach'
      },
      ...data!.coaches.map((coach) => ({
        email: coach.email,
        fullName: coach.fullName,
        id: coach.id,
        role: 'coach' as TMasterTeamRole
      }))
    ],
    players: data!.players.map((player) => ({
      id: player.id,
      name: player.fullName
    })),
    teamAdministrators: data!.teamsAdmins.map((teamAdmin) => ({
      email: teamAdmin.email,
      fullName: teamAdmin.fullName,
      id: teamAdmin.id,
      role: 'admin'
    }))
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Edit Master Team</title>
      </Helmet>

      <BaseLayout>
        <PageContainer vertical>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />
          <ProtectedPageTitle>Edit Master Team</ProtectedPageTitle>

          <MasterTeamForm
            validationSchema={masterTeamsValidationSchema}
            onSubmit={handleSubmit}
            initialValues={initialData}
            goBack={goBack}
          />
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default EditMasterTeam

