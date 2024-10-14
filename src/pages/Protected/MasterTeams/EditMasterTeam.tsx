import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { FieldArray, Form, Formik, FormikErrors } from 'formik'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PopulateEntity from '@/pages/Protected/MasterTeams/components/PopulateEntity'
import {
  IMasterTeamRole,
  IPopulateMasterTeam,
  TMasterTeamRole,
  getInitialEntity,
  masterTeamsValidationSchema,
} from '@/pages/Protected/MasterTeams/formik'

import {
  Accordion,
  AccordionHeader,
  AddEntityButton,
  CancelButton,
  MainContainer,
  MonroeBlueText,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageTitle,
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'
import UsersMultipleSelectWithSearch from '@/components/UsersMultipleSelectWithSearch'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useEditMasterTeamMutation, useGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'
import { IDetailedError } from '@/common/interfaces'

import ShowAllIcon from '@/assets/icons/show-all.svg'

const EditMasterTeam = () => {
  const params = useParams<{ id: string }>()
  const navigation = useNavigate()
  const { setAppNotification } = useAppSlice()
  const { data, isLoading, isError } = useGetMasterTeamQuery({ id: params?.id || '' }, { skip: !params.id })
  const [editMT] = useEditMasterTeamMutation()

  useEffect(() => {
    if (isError) navigation(PATH_TO_MASTER_TEAMS)
  }, [isError])

  const goBack = () => navigation(PATH_TO_MASTER_TEAMS)

  const handleSubmit = (values: IPopulateMasterTeam) => {
    const coachesIds = values.coaches.filter((value) => value.role !== 'head-coach').map((coach) => coach.id)
    const playersIds = values.players.map((player) => player.id)
    const teamAdminIds = values.teamAdministrators.map((teamAdmin) => teamAdmin.id)

    const body = {
      name: values.name,
      head_coach: values.coaches[0].id,
      coaches: coachesIds,
      players: playersIds,
      team_admins: teamAdminIds,
    }

    editMT({
      id: params!.id as string,
      body,
    })
      .unwrap()
      .then(() => {
        goBack()
      })
      .catch((error) => {
        const message = (error as IDetailedError).details

        setAppNotification({
          message,
          type: 'error',
        })
      })
  }

  if (!data && isLoading) return <Loader />

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a>,
    },
    {
      title: <MonroeBlueText>{data!.name}</MonroeBlueText>,
    },
  ]

  const initialData: IPopulateMasterTeam = {
    name: data!.name,
    coaches: [
      {
        ...data!.headCoach,
        role: 'head-coach',
      },
      ...data!.coaches.map((coach) => ({
        email: coach.email,
        fullName: coach.fullName,
        id: coach.id,
        role: 'coach' as TMasterTeamRole,
      })),
    ],
    players: data!.players.map((player) => ({
      id: player.id,
      name: player.fullName,
    })),
    teamAdministrators: data!.teamsAdmins.map((teamAdmin) => ({
      email: teamAdmin.email,
      fullName: teamAdmin.fullName,
      id: teamAdmin.id,
      role: 'admin',
    })),
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Edit Master Team</title>
      </Helmet>

      <BaseLayout>
        <Formik
          initialValues={initialData}
          validationSchema={masterTeamsValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur
          validateOnMount
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue, handleBlur, touched, setFieldTouched }) => {
            const isTeamAdministratorsHaveErrors = !!errors.teamAdministrators?.length
            const isCoachesHaveErrors = !!errors.coaches?.length
            const collapsedTeamAdministrators = (removeFn: (index: number) => void) =>
              values.teamAdministrators.map((teamAdministrator, idx) => ({
                key: idx,
                children: (
                  <PopulateEntity
                    index={idx}
                    entity={teamAdministrator}
                    errors={errors.teamAdministrators as FormikErrors<IMasterTeamRole>[]}
                    setFieldValue={setFieldValue}
                    removeFn={removeFn}
                    setFieldTouched={setFieldTouched}
                    entityName="teamAdministrators"
                    touched={touched}
                    totalNumberOfItems={values.teamAdministrators.length}
                  />
                ),
                label: <AccordionHeader>#{idx + 1} Admin</AccordionHeader>,
              }))

            const collapsedCoaches = (removeFn: (index: number) => void) =>
              values.coaches.map((coach, idx) => ({
                key: idx,
                children: (
                  <PopulateEntity
                    index={idx}
                    entity={coach}
                    errors={errors.coaches as FormikErrors<IMasterTeamRole>[]}
                    setFieldValue={setFieldValue}
                    removeFn={removeFn}
                    setFieldTouched={setFieldTouched}
                    entityName="coaches"
                    touched={touched}
                    totalNumberOfItems={values.coaches.length}
                  />
                ),
                label: <AccordionHeader>{idx === 0 ? 'Head Coach' : <>#{idx + 1} Coach</>}</AccordionHeader>,
              }))

            return (
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical>
                  <Breadcrumb items={BREAD_CRUMB_ITEMS} />

                  <ProtectedPageTitle>Edit {data!.name}</ProtectedPageTitle>

                  <PageContent>
                    <Flex>
                      <div className="f-40">
                        <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <MonroeInput
                          name="name"
                          label={<OptionTitle className="pb-5">Master Team Name *</OptionTitle>}
                          value={values.name}
                          onChange={handleChange}
                          placeholder="Enter master team name"
                          className="h-32"
                          error={touched.name ? errors.name : ''}
                          onBlur={handleBlur}
                        />
                      </MainContainer>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="pt-12 f-40">
                        <ProtectedPageSubtitle>Team administrator(s)</ProtectedPageSubtitle>
                      </div>

                      <FieldArray name="teamAdministrators">
                        {({ push, remove }) => (
                          <Flex vertical>
                            <Accordion
                              items={collapsedTeamAdministrators(remove)}
                              expandIconPosition="end"
                              defaultActiveKey={[0]}
                              expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                              accordion
                            />

                            <MonroeTooltip
                              text={
                                isTeamAdministratorsHaveErrors
                                  ? "You can't create admin when you have errors in other admins"
                                  : ''
                              }
                              width="220px"
                              containerWidth="113px"
                            >
                              <AddEntityButton
                                disabled={isTeamAdministratorsHaveErrors}
                                type="default"
                                icon={<PlusOutlined />}
                                iconPosition="start"
                                onClick={() => push(getInitialEntity('admin'))}
                                className="w-auto"
                              >
                                Add admin
                              </AddEntityButton>
                            </MonroeTooltip>
                          </Flex>
                        )}
                      </FieldArray>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="pt-12 f-40">
                        <ProtectedPageSubtitle>Coach(es)</ProtectedPageSubtitle>
                      </div>

                      <FieldArray name="coaches">
                        {({ push, remove }) => (
                          <Flex vertical>
                            <Accordion
                              items={collapsedCoaches(remove)}
                              expandIconPosition="end"
                              defaultActiveKey={[0]}
                              expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                              accordion
                            />

                            <MonroeTooltip
                              text={
                                isCoachesHaveErrors
                                  ? "You can't create coach when you have errors in other coaches"
                                  : ''
                              }
                              width="220px"
                              containerWidth="113px"
                            >
                              <AddEntityButton
                                disabled={isCoachesHaveErrors}
                                type="default"
                                icon={<PlusOutlined />}
                                iconPosition="start"
                                onClick={() => push(getInitialEntity('coach'))}
                                className="w-auto"
                              >
                                Add coach
                              </AddEntityButton>
                            </MonroeTooltip>
                          </Flex>
                        )}
                      </FieldArray>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="pt-12 f-40">
                        <ProtectedPageSubtitle>Players</ProtectedPageSubtitle>
                      </div>

                      <div>
                        <AccordionHeader className="mg-v5">Players</AccordionHeader>

                        <UsersMultipleSelectWithSearch
                          isError={false}
                          onBlur={() => setFieldTouched('players', true)}
                          onChange={(values) => setFieldValue(`players`, values)}
                          selectedUsers={values.players}
                        />
                      </div>
                    </Flex>

                    <MonroeDivider className="mg-v24" />

                    <Flex>
                      <div className="f-40" />
                      <Flex>
                        <CancelButton type="default" onClick={goBack}>
                          Cancel
                        </CancelButton>

                        <MonroeButton className="h-40" label="Edit Master Team" type="primary" onClick={handleSubmit} />
                      </Flex>
                    </Flex>
                  </PageContent>
                </PageContainer>
              </Form>
            )
          }}
        </Formik>
      </BaseLayout>
    </>
  )
}

export default EditMasterTeam

