import { Breadcrumb, Divider, Flex, Typography } from 'antd'
import Radio from 'antd/es/radio'
import { Form, Formik } from 'formik'
import { useCallback, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { PLAYOFFS_TEAMS_OPTIONS } from '@/pages/Protected/LeaguesAndTournaments/constants'
import { validationSchema } from '@/pages/Protected/LeaguesAndTournaments/constants/formik'
import {
  DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP,
  DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP,
} from '@/pages/Protected/LeaguesAndTournaments/constants/tooltips'

import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeTextarea from '@/components/Inputs/MonroeTextarea'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useGetLeagueQuery, useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import { IFECreateLeagueBody } from '@/common/interfaces/league'

import './edit.styles.css'

import InfoCircleIcon from '@/assets/icons/info-circle.svg'

const EditLeague = () => {
  const [updateLeague] = useUpdateLeagueMutation()
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const leagueId = params.id || ''
  const { setAppNotification } = useAppSlice()
  const { data, currentData, isError, isLoading } = useGetLeagueQuery(leagueId, {
    skip: !leagueId,
    refetchOnMountOrArgChange: true,
  })
  const initialFormValues: IFECreateLeagueBody = {
    description: currentData?.description || '',
    name: currentData?.name || '',
    playoffFormat: (currentData?.playoffFormat === 'Best Record Wins' ? 0 : 1) || 0,
    standingsFormat: currentData?.standingsFormat === 'Winning %' ? 0 : 1 || 0,
    tiebreakersFormat: currentData?.tiebreakersFormat === 'Winning %' ? 0 : 1 || 0,
    type: currentData?.type === 'League' ? 0 : 1 || 0,
    welcomeNote: currentData?.welcomeNote || '',
    playoffsTeams: currentData?.playoffsTeams || 0,
  }

  const mockedInitialValues = useMemo(() => initialFormValues, [data])

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE}>League & Tourn</a>,
    },
    {
      title: (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {data?.name}
        </Typography.Text>
      ),
    },
  ]

  const goBack = useCallback(() => navigate(PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE), [])

  const handleSubmit = ({
    playoffFormat,
    standingsFormat,
    tiebreakersFormat,
    welcomeNote,
    playoffsTeams,
    ...rest
  }: IFECreateLeagueBody) =>
    updateLeague({
      id: leagueId,
      body: {
        playoff_format: playoffFormat,
        standings_format: standingsFormat,
        tiebreakers_format: tiebreakersFormat,
        welcome_note: welcomeNote,
        playoffs_teams: playoffsTeams,
        ...rest,
      },
    })
      .unwrap()
      .then(() => {
        setAppNotification({
          message: 'Your edits were done successfully',
          timestamp: new Date().getTime(),
          type: 'success',
        })
        goBack()
      })

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

  useEffect(() => {
    if (!data && !isLoading) navigate(PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE)
  }, [isError, isLoading, data])

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Edit League/Tournament</title>
        </Helmet>

        {!data && isLoading && <Loader />}

        {data && (
          <Flex className="container" vertical>
            <Breadcrumb items={BREAD_CRUMB_ITEMS} />

            <Typography.Title level={1} className="title">
              Edit {data?.name}
            </Typography.Title>

            <div className="content">
              <Formik initialValues={mockedInitialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange, errors, handleSubmit, setFieldValue }) => {
                  const isEnabledButton = Object.keys(errors).length === 0 && values.name

                  return (
                    <Form onSubmit={handleSubmit}>
                      <Flex>
                        <Typography.Text className="subtitle">Main Info</Typography.Text>

                        <Flex vertical justify="flex-start">
                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Name *</Typography.Text>
                            <MonroeInput
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              placeholder="Enter league/tourn name"
                            />
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Type *</Typography.Text>
                            <Radio.Group
                              name="type"
                              className="radio-group-container"
                              onChange={handleChange}
                              value={values.type}
                            >
                              <Radio value={0}>League</Radio>
                              <Radio value={1}>Tournament</Radio>
                            </Radio.Group>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">League Description</Typography.Text>
                            <MonroeTextarea
                              name="description"
                              value={values.description}
                              onChange={handleChange}
                              placeholder="Enter description"
                              resize="vertical"
                              initialHeight={120}
                            />
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Welcome Note</Typography.Text>
                            <MonroeTextarea
                              name="welcomeNote"
                              value={values.welcomeNote}
                              onChange={handleChange}
                              placeholder="Enter welcome note"
                              resize="vertical"
                              initialHeight={120}
                            />
                          </div>
                        </Flex>
                      </Flex>

                      <Divider />

                      <Flex>
                        <Typography.Text className="subtitle">Default Formats</Typography.Text>

                        <Flex vertical justify="flex-start">
                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Default Playoff Format *</Typography.Text>
                            <Radio.Group
                              name="playoffFormat"
                              className="radio-group-container"
                              onChange={handleChange}
                              value={values.playoffFormat}
                            >
                              <Radio value={0}>Best Record Wins</Radio>
                              <Radio value={1}>Single Elimination Bracket</Radio>
                            </Radio.Group>

                            {values.playoffFormat === 1 && (
                              <Flex align="center" style={{ marginBottom: '48px' }}>
                                <Typography.Text
                                  style={{
                                    color: 'rgba(26, 22, 87, 1)',
                                    fontWeight: 500,
                                    marginRight: '8px',
                                  }}
                                >
                                  # playoffs' teams:{' '}
                                </Typography.Text>

                                <MonroeSelect
                                  defaultValue={`${mockedInitialValues.playoffsTeams}` || '4'}
                                  name="playoffsTeams"
                                  onChange={(value) => setFieldValue('playoffsTeams', +value)}
                                  options={PLAYOFFS_TEAMS_OPTIONS}
                                />
                              </Flex>
                            )}
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Default Standings Format *</Typography.Text>
                            <Radio.Group
                              name="standingsFormat"
                              className="radio-group-container"
                              onChange={handleChange}
                              value={values.standingsFormat}
                            >
                              <Radio value={0}>
                                <div className="radio-container-with-tooltip">
                                  <Typography.Text className="radio-label">Winning %</Typography.Text>

                                  <MonroeTooltip text={DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP} width="135px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </div>
                              </Radio>
                              <Radio value={1}>
                                <div className="radio-container-with-tooltip">
                                  <Typography.Text className="radio-label">Points</Typography.Text>

                                  <MonroeTooltip text={DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP} width="308px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </div>
                              </Radio>
                            </Radio.Group>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <Typography.Text className="option-title">Default Tiebreakers Format *</Typography.Text>
                            <Radio.Group
                              name="tiebreakersFormat"
                              className="radio-group-container"
                              onChange={handleChange}
                              value={values.tiebreakersFormat}
                            >
                              <Radio value={0}>
                                <div className="radio-container-with-tooltip">
                                  <Typography.Text className="radio-label">Winning %</Typography.Text>

                                  <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP} width="320px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </div>
                              </Radio>
                              <Radio value={1}>
                                <div className="radio-container-with-tooltip">
                                  <Typography.Text className="radio-label">Points</Typography.Text>

                                  <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP} width="125px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </div>
                              </Radio>
                            </Radio.Group>
                          </div>
                        </Flex>

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
                            label="Edit"
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
        )}
      </>
    </BaseLayout>
  )
}

export default EditLeague
