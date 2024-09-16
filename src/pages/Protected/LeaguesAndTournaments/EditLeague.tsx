import { Breadcrumb, Flex, Typography } from 'antd'
import Radio from 'antd/es/radio'
import { Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { validationSchema } from '@/pages/Protected/LeaguesAndTournaments/constants/formik'
import {
  DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP,
  DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP,
  DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP,
} from '@/pages/Protected/LeaguesAndTournaments/constants/tooltips'

import {
  CancelButton,
  MonroeBlueText,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageTitle,
  RadioGroupContainer,
  RadioGroupLabel,
  RadioGroupLabelTooltip,
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeTextarea from '@/components/Inputs/MonroeTextarea'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeSelect from '@/components/MonroeSelect'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useGetLeagueQuery, useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { PATH_TO_LEAGUES } from '@/constants/paths'
import { PLAYOFFS_TEAMS_OPTIONS } from '@/constants/playoffsTeamsOptions'

import { IFECreateLeagueBody } from '@/common/interfaces/league'

import InfoCircleIcon from '@/assets/icons/info-circle.svg'

const DEFAULT_PLAYOFFS_TEAMS_VALUE = 4

const EditLeague = () => {
  const [updateLeague] = useUpdateLeagueMutation()
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  const leagueId = params.id || ''
  const { setAppNotification } = useAppSlice()
  const { data, currentData, isError, isLoading, isFetching } = useGetLeagueQuery(leagueId, {
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

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_LEAGUES}>League & Tourn</a>,
    },
    {
      title: <MonroeBlueText>{data?.name}</MonroeBlueText>,
    },
  ]

  const goBack = useCallback(() => navigate(PATH_TO_LEAGUES), [])

  const handleSubmit = async (values: IFECreateLeagueBody, formikHelpers: FormikHelpers<IFECreateLeagueBody>) => {
    const result = await formikHelpers.validateForm(values)

    if (Object.keys(result).length) return

    const { playoffFormat, standingsFormat, tiebreakersFormat, welcomeNote, playoffsTeams, ...rest } = values

    updateLeague({
      id: leagueId,
      body: {
        playoff_format: playoffFormat,
        standings_format: standingsFormat,
        tiebreakers_format: tiebreakersFormat,
        welcome_note: welcomeNote,
        playoffs_teams: playoffsTeams || DEFAULT_PLAYOFFS_TEAMS_VALUE,
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
  }

  useEffect(() => {
    if (!data && !isLoading && !isFetching) navigate(PATH_TO_LEAGUES)
  }, [isError, isLoading, data, isFetching])

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Edit League/Tournament</title>
        </Helmet>

        {!data && (isLoading || isFetching) && <Loader />}

        {data && (
          <PageContainer>
            <Breadcrumb items={BREAD_CRUMB_ITEMS} />

            <ProtectedPageTitle>Edit {data?.name}</ProtectedPageTitle>

            <PageContent>
              <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ values, handleChange, errors, handleSubmit, setFieldValue, handleBlur }) => {
                  const isEnabledButton = Object.keys(errors).length === 0 && values.name

                  return (
                    <Form onSubmit={handleSubmit}>
                      <Flex>
                        <div style={{ flex: '0 0 40%' }}>
                          <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                        </div>

                        <Flex vertical justify="flex-start" style={{ width: '352px' }}>
                          <div style={{ marginBottom: '8px' }}>
                            <MonroeInput
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              placeholder="Enter league/tourn name"
                              label={<OptionTitle>Name *</OptionTitle>}
                              error={errors.name}
                              onBlur={handleBlur}
                            />
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <OptionTitle>Type *</OptionTitle>
                            <RadioGroupContainer name="type" onChange={handleChange} value={values.type}>
                              <Radio value={0}>League</Radio>
                              <Radio value={1}>Tournament</Radio>
                            </RadioGroupContainer>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <OptionTitle>League Description</OptionTitle>
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
                            <OptionTitle>Welcome Note</OptionTitle>
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

                      <MonroeDivider />

                      <Flex>
                        <div style={{ flex: '0 0 40%' }}>
                          <ProtectedPageSubtitle>Default Formats</ProtectedPageSubtitle>
                        </div>

                        <Flex vertical justify="flex-start">
                          <div style={{ marginBottom: '8px' }}>
                            <OptionTitle>Default Playoff Format *</OptionTitle>
                            <RadioGroupContainer
                              name="playoffFormat"
                              onChange={handleChange}
                              value={values.playoffFormat}
                            >
                              <Radio value={0}>Best Record Wins</Radio>
                              <Radio value={1}>Single Elimination Bracket</Radio>
                            </RadioGroupContainer>

                            {values.playoffFormat === 1 && (
                              <Flex align="center">
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
                                  defaultValue={`${initialFormValues.playoffsTeams}` || '4'}
                                  name="playoffsTeams"
                                  onChange={(value) => setFieldValue('playoffsTeams', +value)}
                                  options={PLAYOFFS_TEAMS_OPTIONS}
                                  styles={{
                                    width: '82px',
                                  }}
                                />
                              </Flex>
                            )}
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <OptionTitle>Default Standings Format *</OptionTitle>
                            <RadioGroupContainer
                              name="standingsFormat"
                              onChange={handleChange}
                              value={values.standingsFormat}
                            >
                              <Radio value={0}>
                                <RadioGroupLabelTooltip>
                                  <RadioGroupLabel>Winning %</RadioGroupLabel>

                                  <MonroeTooltip text={DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP} width="135px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </RadioGroupLabelTooltip>
                              </Radio>
                              <Radio value={1}>
                                <RadioGroupLabelTooltip>
                                  <RadioGroupLabel>Points</RadioGroupLabel>

                                  <MonroeTooltip text={DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP} width="308px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </RadioGroupLabelTooltip>
                              </Radio>
                            </RadioGroupContainer>
                          </div>

                          <div style={{ marginBottom: '8px' }}>
                            <OptionTitle>Default Tiebreakers Format *</OptionTitle>
                            <RadioGroupContainer
                              name="tiebreakersFormat"
                              onChange={handleChange}
                              value={values.tiebreakersFormat}
                            >
                              <Radio value={0}>
                                <RadioGroupLabelTooltip>
                                  <RadioGroupLabel>Winning %</RadioGroupLabel>
                                  <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP} width="320px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </RadioGroupLabelTooltip>
                              </Radio>
                              <Radio value={1}>
                                <RadioGroupLabelTooltip>
                                  <RadioGroupLabel>Points</RadioGroupLabel>
                                  <MonroeTooltip text={DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP} width="125px">
                                    <ReactSVG src={InfoCircleIcon} />
                                  </MonroeTooltip>
                                </RadioGroupLabelTooltip>
                              </Radio>
                            </RadioGroupContainer>
                          </div>
                        </Flex>

                        <div />
                      </Flex>

                      <MonroeDivider />

                      <Flex>
                        <div style={{ flex: '0 0 40%' }} />

                        <Flex>
                          <CancelButton type="default" onClick={goBack}>
                            Cancel
                          </CancelButton>

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
            </PageContent>
          </PageContainer>
        )}
      </>
    </BaseLayout>
  )
}

export default EditLeague
