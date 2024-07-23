import { INITIAL_DIVISION_DATA, seasonInitialFormValues, seasonValidationSchema } from './constants/formik'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Breadcrumb, DatePicker, Divider, Flex, Typography } from 'antd'
import { FieldArray, Form, Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'

import BaseLayout from '@/layouts/BaseLayout'

import { PATH_TO_SEASONS_PAGE } from '@/constants/paths'

import { IFELeague } from '@/common/interfaces/league'

import './create.styles.css'

const BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_SEASONS_PAGE}>Seasons</a>,
  },
  {
    title: (
      <Typography.Text
        style={{
          color: 'rgba(26, 22, 87, 0.85)',
        }}
      >
        Create season
      </Typography.Text>
    ),
  },
]

const MOCKED_LEAGUE: IFELeague = {
  id: '53c70a77-f33d-432b-9ec6-96d1f7e2012c',
  type: 'League',
  name: "Artur's League",
  description: 'New description',
  updatedAt: '2024-07-05T08:45:49.638747Z',
  createdAt: '2024-07-03T12:08:55.382491Z',
  playoffFormat: 'Single Elimination Bracket',
  standingsFormat: 'Points',
  tiebreakersFormat: 'Points',
  playoffsTeams: 9,
  welcomeNote: 'New welcome note',
  seasons: [],
}

const MOCKED_TOURN: IFELeague = {
  id: 'fda946e7-8c26-4eee-9d11-51624c88120b',
  type: 'Tourn',
  name: "BArtur's League Team",
  description: 'wdcweqcxew',
  updatedAt: '2024-07-09T11:01:16.508750Z',
  createdAt: '2024-07-01T13:51:49.150165Z',
  playoffFormat: 'Best Record Wins',
  standingsFormat: 'Winning %',
  tiebreakersFormat: 'Winning %',
  playoffsTeams: 0,
  welcomeNote: 'xwecercqewdcqwed',
  seasons: [
    {
      id: 'f7dc3b2d-af97-4271-a6da-6905b332a10b',
      name: "Artur's Season",
    },
  ],
}

const CreateSeason = () => {
  const navigate = useNavigate()
  const [selectedLeagueTourn, setSelectedLeagueTourn] = useState<IFELeague | null>(null)
  const isTourn = selectedLeagueTourn?.type === 'Tourn'

  const goBack = useCallback(() => navigate(PATH_TO_SEASONS_PAGE), [])

  const handleSubmit = () => {}

  useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault()
    })

    return () => {
      window.removeEventListener('beforeunload', (e) => {
        e.preventDefault()
      })
    }
  }, [])

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Create Season</title>
        </Helmet>

        <Flex className="container" vertical>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <Typography.Title level={1} className="title">
            Create season
          </Typography.Title>

          <div className="content">
            <Formik
              initialValues={seasonInitialFormValues}
              validationSchema={seasonValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleSubmit, errors, setFieldValue }) => {
                const isEnabledButton =
                  Object.keys(errors).length &&
                  values.league &&
                  values.name &&
                  values.expectedEndDate &&
                  values.startDate

                return (
                  <Form onSubmit={handleSubmit}>
                    <Flex>
                      <Typography.Text className="subtitle" style={{ marginRight: '32px', width: '300px' }}>
                        Main Info
                      </Typography.Text>

                      <Flex vertical justify="flex-start">
                        <div style={{ marginBottom: '8px' }}>
                          <Typography.Text className="option-title">Name *</Typography.Text>
                          <MonroeInput
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            placeholder="Enter league/tourn name"
                            style={{ height: '32px' }}
                          />
                        </div>

                        <Flex vertical justify="flex-start">
                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Linked League/Tourn *</Typography.Text>
                            <MonroeInput
                              name="league"
                              value={values.league}
                              onChange={handleChange}
                              placeholder="Select the league"
                              style={{ height: '32px' }}
                            />
                          </div>

                          <Flex>
                            <MonroeButton
                              label="select league"
                              onClick={() => {
                                setFieldValue('league', MOCKED_LEAGUE.name)
                                setSelectedLeagueTourn(MOCKED_LEAGUE)
                              }}
                              type="primary"
                            />

                            <MonroeButton
                              label="select tourn"
                              onClick={() => {
                                setFieldValue('league', MOCKED_TOURN.name)
                                setSelectedLeagueTourn(MOCKED_TOURN)
                              }}
                              type="default"
                            />
                          </Flex>
                        </Flex>

                        <Flex vertical justify="flex-start" style={{ marginBottom: '8px' }}>
                          <Typography.Text className="option-title">Start Date *</Typography.Text>
                          <DatePicker
                            name="startDate"
                            value={values.startDate}
                            onChange={(date) => setFieldValue('startDate', date)}
                          />
                        </Flex>

                        <Flex vertical justify="flex-start" style={{ marginBottom: '8px' }}>
                          <Typography.Text className="option-title">Expected End Date *</Typography.Text>
                          <DatePicker
                            name="expectedEndDate"
                            value={values.expectedEndDate}
                            onChange={(date) => setFieldValue('expectedEndDate', date)}
                          />
                        </Flex>
                      </Flex>
                    </Flex>

                    <Divider />

                    <Flex>
                      <Flex vertical style={{ marginRight: '32px', width: '300px' }}>
                        <Typography.Text className="subtitle">Division/Pool</Typography.Text>

                        {values.league && (
                          <Typography.Text
                            style={{
                              color: '#888791',
                              fontSize: '12px',
                              maxWidth: '300px',
                            }}
                          >
                            Preselection for some settings is made based on the default settings of the linked
                            league/tournament.
                          </Typography.Text>
                        )}
                      </Flex>

                      <FieldArray name="divisions">
                        {({ push, remove }) => (
                          <Flex vertical>
                            {!values.league && (
                              <Typography.Text
                                style={{
                                  color: 'rgba(26, 22, 87, 0.85)',
                                  fontSize: '12px',
                                }}
                              >
                                A division/pool can't be created until a league/tourn is linked.
                              </Typography.Text>
                            )}

                            {values.league && (
                              <>
                                <Flex vertical>
                                  <div>
                                    {values.divisions.map((_, idx) => (
                                      <>
                                        <Typography>Division {idx}</Typography>
                                        <Typography onClick={() => remove(idx)}>delete {idx}</Typography>
                                      </>
                                    ))}
                                  </div>
                                </Flex>

                                <MonroeButton
                                  label={isTourn ? 'Add Pool' : 'Add Division'}
                                  type="default"
                                  icon={<PlusOutlined />}
                                  iconPosition="start"
                                  onClick={() => push(INITIAL_DIVISION_DATA)}
                                  className="view-edit-button"
                                />
                              </>
                            )}
                          </Flex>
                        )}
                      </FieldArray>

                      <div />
                    </Flex>

                    <Divider />

                    <Flex justify="center">
                      <Flex style={{ width: '300px' }}>
                        <MonroeButton
                          className="cancel-button"
                          label="Cancel"
                          type="default"
                          onClick={goBack}
                          isDisabled={false}
                        />

                        <MonroeButton
                          label="Create Season"
                          type="primary"
                          onClick={handleSubmit}
                          isDisabled={!isEnabledButton}
                        />
                      </Flex>
                    </Flex>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </Flex>
      </>
    </BaseLayout>
  )
}

export default CreateSeason

