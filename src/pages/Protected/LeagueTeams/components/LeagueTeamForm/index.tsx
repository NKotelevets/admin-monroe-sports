import { Form, Formik, FormikHelpers } from 'formik'
import {
  CancelButton,
  MainContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageSubtitleDescription
} from '@/components/Elements'
import Flex from 'antd/es/flex'
import { Divider, Tabs } from 'antd'
import { IFormProps } from '@/common/interfaces'
import styled from '@emotion/styled'
import MonroeButton from '@/components/MonroeButton.tsx'
import TabPane from 'antd/es/tabs/TabPane'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { ReactElement, useCallback, useState } from 'react'
import { IFELeague, ILeagueForm } from '@/common/interfaces/league.ts'
import { DivisionSubdivisionDropdown } from './DivisionSubdivisionDropdown'
import { MasterTeamDropdown } from '@/pages/Protected/LeagueTeams/components/LeagueTeamForm/MasterTeamDropdown.tsx'
import { MasterTeamAdminDropdown } from './MasterTeamAdminDropdown'
import { LeagueTournDropdown } from './LeagueTournDropdown'
import { leagueTeamValidationSchema } from './validation'
import { AddingMasterTeam } from '@/pages/Protected/LeagueTeams/components/LeagueTeamForm/AddingMasterTeam.tsx'

const leagueTeamInitialValues: ILeagueForm = {
  name: '',
  masterTeam: undefined,
  masterTeamAdmin: undefined,
  masterTeamAdminName: '',
  league: undefined,
  division: undefined,
  subdivision: undefined,
  masterTeamAdminEmail: ''
}

/**
 * LeagueTeamForm Component
 *
 * This component renders a form to create or edit a league team.
 * It provides fields for entering the team name, selecting or assigning a master team,
 * and linking the team to leagues or tournaments. Validation and submission logic
 * are implemented using Formik, ensuring a seamless user experience.
 *
 * @param {IFormProps<ILeagueForm, ILeagueForm>} props - The properties passed to the component.
 * @param {Object} props.validationSchema - The validation schema for form fields.
 * @param {ILeagueForm | undefined} props.initialValues - The initial values for the form fields.
 * @param {boolean} props.isLoading - Indicates if the form submission is in progress.
 * @param {function} props.onSubmit - Callback function triggered on form submission.
 * @param {function} props.goBack - Callback function triggered when the cancel button is clicked.
 *
 * Main Features:
 * - Formik integration for managing form state, validation, and submission.
 * - Dynamic form behavior based on whether the team is new or being edited.
 * - Tabbed interface for selecting a master team by dropdown or assigning an admin.
 * - Validates exclusive selection between master team and master team admin.
 * - League and tournament linkage using dropdowns.
 *
 * @returns {ReactElement} A form for creating or editing a league team.
 */
export const LeagueTeamForm = (props: IFormProps<ILeagueForm, ILeagueForm>): ReactElement => {
  const {
    validationSchema,
    initialValues,
    isLoading,
    onSubmit,
    goBack
  } = props

  const isNew = initialValues === undefined
  const buttonTitle = isNew ? `Create League Team` : `Edit League Team`
  const [selectedLeague, setSelectedLeague] = useState<IFELeague | null>(null)
  const [addingMasterTeam, setAddingMasterTeam] = useState<boolean>(false)

  const onTabChange = useCallback((setFieldValue: FormikHelpers<ILeagueForm>['setFieldValue']) => {
    return () => {
      setFieldValue('masterTeam', undefined)
      setFieldValue('masterTeamAdmin', undefined)
      setFieldValue('masterTeamAdminName', undefined)
      setFieldValue('masterTeamAdminEmail', undefined)
    }
  }, [])

  const onAddMasterTeam = () => {
    setAddingMasterTeam(true)
  }

  const handleSubmit = useCallback((values: ILeagueForm, { setFieldError }: FormikHelpers<ILeagueForm>) => {
    if (values.masterTeam && values.masterTeamAdmin) {
      setFieldError('masterTeam', 'Choose either a master team or a master team admin')
      return
    }

    if (!values.masterTeam && !values.masterTeamAdmin) {
      setFieldError('masterTeam', 'Choose one master team or one master team admin')
      return
    }

    onSubmit(values)
  }, [])

  return (
    <Formik
      initialValues={initialValues || leagueTeamInitialValues}
      validationSchema={validationSchema || leagueTeamValidationSchema}
      onSubmit={handleSubmit}
      validateOnMount
      validateOnChange
      validateOnBlur
    >
      {({
          values,
          handleChange,
          handleSubmit,
          errors,
          handleBlur,
          touched,
          dirty,
          isValid,
          setFieldValue
        }) => {

        if (addingMasterTeam) {
          return (
            <AddingMasterTeam
              setAddingMasterTeam={setAddingMasterTeam}
            />
          )
        }

        return (
          <Form onSubmit={handleSubmit} className="league-teams">
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                </div>

                <MainContainer>
                  <TextInput
                    label="League Team Name *"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="h-32"
                    error={touched.name ? errors.name as string : undefined}
                    onBlur={handleBlur}
                    disabled={!isNew}
                  />
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Master Team</ProtectedPageSubtitle>
                  <ProtectedPageSubtitleDescription>You can join the Master team you own or select an administrator who
                    will join the corresponding team from his list.</ProtectedPageSubtitleDescription>
                </div>

                <MainContainer>
                  <Tabs
                    onChange={onTabChange(setFieldValue)}
                    defaultActiveKey="1"
                    centered
                  >
                    <TabPane tab="By Master Team" key="1">
                      <MasterTeamDropdown onAddMasterTeam={onAddMasterTeam} setAddingMasterTeam={setAddingMasterTeam} />
                    </TabPane>

                    <TabPane tab="By MT Admin" key="2">
                      <MasterTeamAdminDropdown />
                    </TabPane>

                  </Tabs>
                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Linked Leagues/Tourns</ProtectedPageSubtitle>
                </div>

                <MainContainer>
                  <LeagueTournDropdown setSelectedLeague={setSelectedLeague} />
                  <DivisionSubdivisionDropdown selectedLeague={selectedLeague} />

                </MainContainer>
              </Flex>

              <Line />

              <Flex>
                <div className="f-40" />
                <Flex>
                  <CancelButton type="default" onClick={goBack}>
                    Cancel
                  </CancelButton>

                  <MonroeButton
                    type="primary"
                    className="h-40"
                    isLoading={isLoading}
                    isDisabled={!dirty || !isValid}
                    label={buttonTitle}
                    onClick={handleSubmit}
                  />
                </Flex>
              </Flex>
            </PageContent>
          </Form>
        )
      }}
    </Formik>
  )
}


const Line = styled(Divider)`
    margin: 24px 0 !important
`
