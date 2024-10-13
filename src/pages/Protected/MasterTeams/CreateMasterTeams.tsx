import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { FieldArray, Form, Formik, FormikErrors } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PopulateEntity from '@/pages/Protected/MasterTeams/components/PopulateEntity'
import {
  ICreateMasterTeam,
  IMasterTeamRole,
  getInitialEntity,
  initialCreateMasterTeamValues,
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
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'
import UsersMultipleSelectWithSearch from '@/components/UsersMultipleSelectWithSearch'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useCreateMasterTeamMutation } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'
import { IDetailedError } from '@/common/interfaces'

import ShowAllIcon from '@/assets/icons/show-all.svg'

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
  const [createMasterTeam] = useCreateMasterTeamMutation()
  const { setAppNotification } = useAppSlice()

  const goBack = () => navigation(PATH_TO_MASTER_TEAMS)

  const handleSubmit = (values: ICreateMasterTeam) => {
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

  return (
    <>
      <Helmet>
        <title>Admin Panel | Create Master Team</title>
      </Helmet>

      <BaseLayout>
        <Formik
          initialValues={initialCreateMasterTeamValues}
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
                          onBlur={() => {
                            setFieldTouched('players', true)
                          }}
                          onChange={(values) => {
                            setFieldValue(`players`, values)
                          }}
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

                        <MonroeButton label="Create Master Team" type="primary" onClick={handleSubmit} />
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

