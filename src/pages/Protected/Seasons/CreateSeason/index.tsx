import SearchLeagueTournament from './components/SearchLeagueTournament'
import { INITIAL_DIVISION_DATA, seasonInitialFormValues, seasonValidationSchema } from './constants/formik'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Breadcrumb, Collapse, DatePicker, Divider, Flex, Typography } from 'antd'
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

const CreateSeason = () => {
  const navigate = useNavigate()
  const [selectedLeagueTournament, setSelectedLeagueTournament] = useState<IFELeague | null>(null)

  const isTourn = selectedLeagueTournament?.type === 'Tourn'

  const goBack = useCallback(() => navigate(PATH_TO_SEASONS_PAGE), [])

  const handleSubmit = () => {}

  const handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnloadEvent)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadEvent)
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
              validateOnChange
            >
              {({ values, handleChange, handleSubmit, errors, setFieldValue }) => {
                const isEnabledButton =
                  Object.keys(errors).length &&
                  values.league &&
                  values.name &&
                  values.expectedEndDate &&
                  values.startDate

                const collapsedDivisionItems = values.divisions.map((_, idx) => ({
                  key: idx,
                  children: [],
                  label: (
                    <Typography
                      style={{
                        color: '#1A1657',
                        fontSize: '16px',
                        fontWeight: 500,
                      }}
                    >
                      #{idx + 1} {isTourn ? 'Pool' : 'Division'}{' '}
                    </Typography>
                  ),
                }))

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

                            <SearchLeagueTournament
                              selectedLeague={selectedLeagueTournament}
                              setLeagueTournament={(data) => {
                                setFieldValue('league', data.name)
                                setSelectedLeagueTournament(data)
                              }}
                            />
                          </div>
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
                        {({ push }) => (
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
                                    <Collapse
                                      items={collapsedDivisionItems}
                                      expandIconPosition="end"
                                      defaultActiveKey={['1']}
                                      accordion
                                      style={{
                                        border: 0,
                                        width: '352px',
                                        backgroundColor: 'transparent',
                                        marginBottom: '24px',
                                      }}
                                    />
                                  </div>
                                </Flex>

                                <div>
                                  <MonroeButton
                                    label={isTourn ? 'Add Pool' : 'Add Division'}
                                    isDisabled={!!errors.divisions?.length}
                                    type="default"
                                    icon={<PlusOutlined />}
                                    iconPosition="start"
                                    onClick={() => push(INITIAL_DIVISION_DATA)}
                                    className="view-edit-button"
                                    style={{
                                      width: isTourn ? '124px' : '140px',
                                    }}
                                  />
                                </div>
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
