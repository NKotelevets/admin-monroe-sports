import { Form, Formik, useFormikContext } from 'formik'
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
import Dropdown from '@/components/Inputs/Dropdown.tsx'
import * as Yup from 'yup'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api.ts'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice.ts'
import { IFELeague, IGetLeaguesRequestParams } from '@/common/interfaces/league.ts'

interface ITemp {
  name: string
  masterTeam: string | undefined
  masterTeamAdmin: string | undefined
  league: string | undefined
  division: string | undefined
  subdivision: string | undefined
  masterTeamAdminEmail: string
}

const leagueTeamInitialValues: ITemp = {
  name: '',
  masterTeam: undefined,
  masterTeamAdmin: undefined,
  league: undefined,
  division: undefined,
  subdivision: undefined,
  masterTeamAdminEmail: ''
}

const leagueTeamValidationSchema = Yup.object<ITemp>().shape({
  name: Yup.string().required('Name is required'),
  masterTeam: Yup.string().required('Master team is required'), // FIXME: this or master team admin
  masterTeamAdmin: Yup.string().required('Master team admin is required'),
  league: Yup.string().required('League is required'),
  division: Yup.string().required('Division is required'),
  masterTeamAdminEmail: Yup.string().required('Master team admin email is required')
})

export const LeagueTeamForm = (props: IFormProps<ITemp, ITemp>) => {
  const {
    validationSchema,
    initialValues,
    isLoading,
    onSubmit,
    goBack
  } = props


  const isNew = true
  const pageTitle = isNew ? 'Create' : 'Edit'

  const handleSubmit = (values: ITemp) => {
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
          dirty
        }) => {

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
                    defaultActiveKey="1"
                    centered
                  >
                    <TabPane tab="By Master Team" key="1">
                      <MasterTeamDropdown />
                    </TabPane>

                    <TabPane tab="By MT Admin" key="2">
                      <Dropdown
                        showSearch
                        label="Master Team Administrator *"
                        placeholder="Select master team administrator"
                        optionFilterProp="label"
                        value={values.masterTeamAdmin}
                        onChange={handleChange('masterTeamAdmin')}
                        options={[
                          { value: '1', label: 'Not Identified' },
                          { value: '2', label: 'Closed' }
                        ]}
                        buttonAction={alert}
                        buttonText="Add master team admin"
                        error={touched.masterTeamAdmin ? errors.masterTeamAdmin as string : ''}
                        onBlur={handleBlur('masterTeamAdmin')}
                      />

                      <TextInput
                        label="League Team Name *"
                        name="masterTeamAdminEmail"
                        value={values.masterTeamAdminEmail}
                        onChange={handleChange}
                        placeholder="Enter master team admin email"
                        className="h-32"
                        error={touched.masterTeamAdminEmail ? errors.masterTeamAdminEmail as string : undefined}
                        onBlur={handleBlur}
                        disabled={!isNew}
                      />
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
                  <LeagueTournDropdown />

                  <Dropdown
                    showSearch
                    label="Division/Pool *"
                    placeholder="Select division/pool"
                    optionFilterProp="label"
                    value={values.division}
                    onChange={handleChange('division')}
                    options={[
                      { value: '1', label: 'Not Identified' },
                      { value: '2', label: 'Closed' }
                    ]}
                    error={touched.division ? errors.division as string : ''}
                    onBlur={handleBlur}
                  />

                  <Dropdown
                    showSearch
                    label="Subivision/Pool *"
                    placeholder="Select subdivision/pool"
                    optionFilterProp="label"
                    value={values.division}
                    onChange={handleChange('division')}
                    options={[
                      { value: '1', label: 'Not Identified' },
                      { value: '2', label: 'Closed' }
                    ]}
                    error={touched.division ? errors.division as string : ''}
                    onBlur={handleBlur}
                  />

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


const MasterTeamDropdown = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ITemp>()

  const {
    masterTeams,
    setPaginationParams,
    offset,
    ordering,
    total,
    limit
  } = useMasterTeamsSlice()

  const [masterTeamList, { isLoading, isFetching }] = useLazyGetMasterTeamsQuery()
  const [masterTeamItems, setMasterTeamItems] = useState<IFEMasterTeam[]>([])
  const [selectedMasterTeam, setSelectedMasterTeam] = useState<IFEMasterTeam | null>(null)

  useEffect(() => {
    setPaginationParams({ offset, limit, ordering })
    masterTeamList({ limit, offset, ordering: ordering || undefined })
  }, [])

  useEffect(() => {
    setMasterTeamItems(mt => ([...mt, ...masterTeams]))
  }, [masterTeams])

  useEffect(() => {
    if (values.masterTeam) {
      const mt = masterTeamItems.findIndex(mt => mt.id === values.masterTeam)
      setSelectedMasterTeam(masterTeamItems[mt])
      setFieldValue('masterTeamAdmin', mt ? masterTeamItems[mt]?.teamAdminId : '')
      setFieldValue('teamAdminEmail', mt ? masterTeamItems[mt]?.teamAdminEmail : '')
    }
  }, [values.masterTeam, masterTeamItems])

  const endReached = useMemo(() => (
    masterTeamItems.length >= total
  ), [masterTeamItems, total])

  const onLoadMore = useCallback(() => {
    if (endReached) return

    const leagueTeamsRequestParams: IGetLeagueTeamsRequest = {
      offset: offset + 10,
      limit
    }

    masterTeamList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      ordering: null
    })
  }, [endReached, offset, limit])

  return (
    <>
      <Dropdown
        showSearch
        loading={isLoading || isFetching}
        label="Master Team *"
        placeholder="Select master team"
        optionFilterProp="label"
        value={values.masterTeam}
        onChange={handleChange('masterTeam')}
        onLoadMore={!endReached ? onLoadMore : undefined}
        options={masterTeamItems.map(mt => ({ label: mt.name, value: mt.id }))}
        buttonAction={alert}
        buttonText="Add master team"
        error={touched.masterTeam ? errors.masterTeam as string : ''}
        onBlur={handleBlur('masterTeam')}
      />

      {!!selectedMasterTeam && (
        <>
          <Dropdown
            disabled
            label="Master Team Administrator *"
            placeholder="Select master team"
            optionFilterProp="label"
            value={values.masterTeamAdmin}
            onChange={handleChange('masterTeamAdmin')}
            error={touched.masterTeamAdmin ? errors.masterTeamAdmin as string : ''}
            options={[
              { label: selectedMasterTeam.teamAdminFullName, value: selectedMasterTeam.teamAdminId }
            ]}
            onBlur={handleBlur('masterTeamAdmin')}
          />
          <Dropdown
            disabled
            label="Master Team Admin Email "
            placeholder="Select master team"
            value={values.masterTeamAdminEmail}
            onChange={handleChange('masterTeamAdminEmail')}
            error={touched.masterTeamAdminEmail ? errors.masterTeamAdminEmail as string : ''}
            options={[
              { label: selectedMasterTeam.teamAdminEmail, value: values.masterTeamAdminEmail }
            ]}
            onBlur={handleBlur('masterTeamAdminEmail')}
          />
        </>
      )}
    </>
  )
}

const LeagueTournDropdown = () => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  } = useFormikContext<ITemp>()

  const {
    leagues,
    setPaginationParams,
    offset,
    order_by: ordering,
    total,
    limit
  } = useLeagueSlice()

  const [leaguesList, { isLoading, isFetching }] = useLazyGetLeaguesQuery()
  const [leagueItems, setLeagueItems] = useState<IFELeague[]>([])

  // console.log({leagueItems})
  useEffect(() => {
    setPaginationParams({ offset, limit, order_by: ordering })
    leaguesList({ limit, offset, order_by: ordering || undefined })
  }, [])

  useEffect(() => {
    setLeagueItems(mt => ([...mt, ...leagues]))
  }, [leagues])

  const endReached = useMemo(() => (
    leagueItems.length >= total
  ), [leagueItems, total])

  const onLoadMore = useCallback(() => {
    if (endReached) return

    const leagueTeamsRequestParams: IGetLeaguesRequestParams = {
      offset: offset + 10,
      limit: limit || 10
    }

    leaguesList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      order_by: null
    })
  }, [endReached, offset, limit])

  return (
    <Dropdown
      showSearch
      loading={isLoading || isFetching}
      label="League/Tournment *"
      placeholder="Select legue/tourn"
      optionFilterProp="label"
      value={values.league}
      onChange={handleChange('league')}
      onLoadMore={!endReached ? onLoadMore : undefined}
      options={leagueItems.map(mt => ({ label: mt.name, value: mt.id }))}
      error={touched.league ? errors.league as string : ''}
      onBlur={handleBlur('league')}
    />
  )
}

const Line = styled(Divider)`
    margin: 24px 0 !important;
`
