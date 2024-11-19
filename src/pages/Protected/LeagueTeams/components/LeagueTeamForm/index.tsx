import { Form, Formik } from 'formik'
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
import * as Yup from 'yup'
import { useState } from 'react'
import { IFELeague, ILeagueForm } from '@/common/interfaces/league.ts'
import { DivisionSubdivisionDropdown } from './DivisionSubdivisionDropdown'
import { MasterTeamDropdown } from '@/pages/Protected/LeagueTeams/components/LeagueTeamForm/MasterTeamDropdown.tsx'
import { MasterTeamAdminDropdown } from './MasterTeamAdminDropdown'
import { LeagueTournDropdown } from './LeagueTournDropdown'

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

const leagueTeamValidationSchema = Yup.object<ILeagueForm>().shape({
  name: Yup.string().required('Name is required'),
  masterTeam: Yup.string()
    .test(
      'fieldA-required-if-fieldB-empty',
      'Master Team is required',
      function(value) {
        const { masterTeamAdmin } = this.parent
        if (!masterTeamAdmin || masterTeamAdmin.trim() === '') {
          return !!value && value.trim() !== ''
        }
        return true
      }
    ),
  masterTeamAdmin: Yup.string().test(
    'fieldB-required-if-fieldA-filled',
    'Master Team Admin is required',
    function(value) {
      const { masterTeam } = this.parent
      if (!masterTeam || masterTeam.trim() === '') {
        return !!value && value.trim() !== ''
      }
      return true
    }
  ),
  league: Yup.string().required('League is required'),
  division: Yup.string().required('Division is required'),
  subdivision: Yup.string().required('Subdivision is required')
})

export const LeagueTeamForm = (props: IFormProps<ILeagueForm, ILeagueForm>) => {
  const {
    validationSchema,
    initialValues,
    isLoading,
    onSubmit,
    goBack
  } = props

  const isNew = true
  const pageTitle = isNew ? 'Create' : 'Edit'
  const [selectedLeague, setSelectedLeague] = useState<IFELeague | null>(null)

  const handleSubmit = (values: ILeagueForm) => {
    onSubmit(values)
  }

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
          isValid
        }) => {

        return (
          <Form onSubmit={handleSubmit} className="league-teams">
            <PageContent>
              <Flex>
                <div className="f-40">
                  <ProtectedPageSubtitle>Main Info {isValid ? 'valido' : 'invalido'}</ProtectedPageSubtitle>
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
                    defaultActiveKey="1"
                    centered
                  >
                    <TabPane tab="By Master Team" key="1">
                      <MasterTeamDropdown />
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
                  <ProtectedPageSubtitleDescription>You can join the Master team you own or select an administrator who
                    will join the corresponding team from his list.</ProtectedPageSubtitleDescription>
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
                    isDisabled={!dirty}
                    label={pageTitle}
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
