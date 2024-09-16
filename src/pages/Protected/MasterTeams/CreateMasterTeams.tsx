import MasterTeamMultipleSelect from './components/MasterTeamsMultipleSelect'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { FieldArray, Form, Formik, FormikErrors } from 'formik'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import PopulateEntity from '@/pages/Protected/MasterTeams/components/PopulateEntity'
import {
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

import BaseLayout from '@/layouts/BaseLayout'

import { PATH_TO_MASTER_TEAMS } from '@/constants/paths'

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

  const goBack = () => navigation(PATH_TO_MASTER_TEAMS)

  const handleSubmit = () => {}

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
                    onChange={handleChange}
                    setFieldValue={setFieldValue}
                    removeFn={removeFn}
                    setFieldTouched={setFieldTouched}
                    entityName="teamAdministrators"
                    touched={touched}
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
                    onChange={handleChange}
                    setFieldValue={setFieldValue}
                    removeFn={removeFn}
                    setFieldTouched={setFieldTouched}
                    entityName="coaches"
                    touched={touched}
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
                      <div style={{ flex: '0 0 40%' }}>
                        <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                      </div>

                      <MainContainer>
                        <MonroeInput
                          name="name"
                          label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Master Team Name *</OptionTitle>}
                          value={values.name}
                          onChange={handleChange}
                          placeholder="Enter master team name"
                          style={{ height: '32px' }}
                          error={touched.name ? errors.name : ''}
                          onBlur={handleBlur}
                        />
                      </MainContainer>
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px 0 12px',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%', paddingTop: '12px' }}>
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
                                style={{
                                  width: 'auto',
                                }}
                              >
                                Add admin
                              </AddEntityButton>
                            </MonroeTooltip>
                          </Flex>
                        )}
                      </FieldArray>
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px 0 ',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%', paddingTop: '12px' }}>
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
                                style={{
                                  width: 'auto',
                                }}
                              >
                                Add coach
                              </AddEntityButton>
                            </MonroeTooltip>
                          </Flex>
                        )}
                      </FieldArray>
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px 0 ',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%', paddingTop: '12px' }}>
                        <ProtectedPageSubtitle>Players</ProtectedPageSubtitle>
                      </div>

                      <MasterTeamMultipleSelect
                        handleBlur={() => {
                          setFieldTouched('players', true)
                        }}
                        setFieldValue={setFieldValue}
                        isError={false}
                        values={values.players}
                      />
                    </Flex>

                    <MonroeDivider
                      style={{
                        margin: '24px 0 ',
                      }}
                    />

                    <Flex>
                      <div style={{ flex: '0 0 40%' }} />
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

