import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { FieldArray, Form, Formik } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import {
  IPopulateMasterTeam,
  getInitialEntity,
  initialCreateMasterTeamValues,
  masterTeamsValidationSchema,
} from '@/pages/Protected/MasterTeams/formik'

import {
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
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'
import UsersMultipleSelectWithSearch from '@/components/UsersMultipleSelectWithSearch'

import BaseLayout from '@/layouts/BaseLayout'

import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useCreateMasterTeamMutation } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'

import { useAppSlice } from '@/redux/hooks/useAppSlice.ts'
import EntityList from '@/pages/Protected/MasterTeams/components/ListEntity.tsx'

const DEFAULT_ERROR_MESSAGE = 'Master Team could not be created. Please, try again!'
const BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a>,
  },
  {
    title: <MonroeBlueText>Create master team</MonroeBlueText>,
  },
]

const CreateMasterTeam = () => {
  const navigation = useNavigate()
  const { setAppNotification } = useAppSlice()
  const [createMasterTeam] = useCreateMasterTeamMutation()
  const { user } = useUserSlice()

  const goBack = () => navigation(PATH_TO_MASTER_TEAMS)

  const handleSubmit = (values: IPopulateMasterTeam) => {
    const coachesIds = values.coaches.filter((value) => value.role !== 'head-coach').map((coach) => coach.id)
    const playersIds = values.players.map((player) => player.id)
    const teamAdminIds = values.teamAdministrators.map((teamAdmin) => teamAdmin.id)

    createMasterTeam({
      name: values.name,
      head_coach: values.coaches[0].id,
      coaches: coachesIds,
      players: playersIds,
      team_admins: teamAdminIds,
    })
      .unwrap()
      .then(() => {
        setAppNotification({
          message: `Master Team "${values.name}" was created`,
          timestamp: new Date().getTime(),
          type: 'success',
        })
        goBack()
      })
      .catch(error => {
        setAppNotification({
          message: error?.data?.error || DEFAULT_ERROR_MESSAGE,
          timestamp: new Date().getTime(),
          type: 'error',
        })
      })
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Create Master Team</title>
      </Helmet>

      <BaseLayout>
        <Formik
          initialValues={{
            ...initialCreateMasterTeamValues,
            teamAdministrators: [
              {
                id: user!.id,
                fullName: user!.firstName + ' ' + user!.lastName,
                email: user!.email,
                role: 'admin',
              },
            ],
          }}
          validationSchema={masterTeamsValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur
          validateOnMount
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue, handleBlur, touched, setFieldTouched }) => {
            const isTeamAdministratorsHaveErrors = !!errors.teamAdministrators?.length
            const isCoachesHaveErrors = !!errors.coaches?.length

            return (
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical>
                  <Breadcrumb items={BREAD_CRUMB_ITEMS} />

                  <ProtectedPageTitle>Create master team</ProtectedPageTitle>

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
                            <EntityList
                              label={(idx: number) => `#${idx + 1} Team Admin`}
                              removeFn={remove}
                              entityName='teamAdministrators'
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
                            <EntityList
                              label={(idx: number) => idx === 0 ? 'Head Coach' : `#${idx + 1} Coach`}
                              removeFn={remove}
                              entityName='coaches'
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

                        <MonroeButton
                          className="h-40"
                          label="Create Master Team"
                          type="primary"
                          onClick={handleSubmit}
                        />
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

export default CreateMasterTeam

