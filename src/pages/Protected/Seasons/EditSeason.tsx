import CreateBracket from './CreateBracket/CreateBracket'
import { AddDivisionPollButton, MainContainer } from './components/Elements'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Breadcrumb, DatePicker, Flex, Typography } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import CreateDivision from '@/pages/Protected/Seasons/components/CreateDivision'
import SearchLeagueTournament from '@/pages/Protected/Seasons/components/SearchLeagueTournament'
import {
  ICreateSeasonFormValues,
  INITIAL_DIVISION_DATA,
  seasonValidationSchema,
} from '@/pages/Protected/Seasons/constants/formik'

import {
  Accordion,
  CancelButton,
  MonroeBlueText,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageSubtitleDescription,
  ProtectedPageTitle,
} from '@/components/Elements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useGetSeasonDetailsQuery, useUpdateSeasonMutation } from '@/redux/seasons/seasons.api'

import { PATH_TO_SEASONS } from '@/constants/paths'

import { ICreateBESeason } from '@/common/interfaces/season'

import ShowAllIcon from '@/assets/icons/show-all.svg'

const EditSeason = () => {
  const navigate = useNavigate()
  const [updateSeason] = useUpdateSeasonMutation()
  const params = useParams<{ id: string }>()
  const { data, isLoading } = useGetSeasonDetailsQuery(params!.id || '', {
    skip: !params.id,
    refetchOnMountOrArgChange: true,
  })
  const [selectedLeague, setSelectedLeague] = useState<string | undefined>(data?.league?.name)
  const { isCreateBracketPage } = useSeasonSlice()

  const goBack = useCallback(() => navigate(PATH_TO_SEASONS), [])

  const handleSubmit = (values: ICreateSeasonFormValues) => {
    const editSeasonBody: ICreateBESeason = {
      name: values.name,
      league_id: values.league,
      start_date: format(new Date(values.startDate as unknown as string), 'yyyy-MM-dd'),
      expected_end_date: format(new Date(values.expectedEndDate as unknown as string), 'yyyy-MM-dd'),
      divisions: values.divisions.map((division) => ({
        id: division.id as string,
        name: division.name,
        description: division.description,
        sub_division: division.subdivisions.map((subdivision) => ({
          id: subdivision.id as string,
          name: subdivision.name,
          description: subdivision.description,
          playoff_format: subdivision.playoffFormat === 'Best Record Wins' ? 0 : 1,
          standings_format: subdivision.standingsFormat !== 'Points' ? 0 : 1,
          tiebreakers_format: subdivision.tiebreakersFormat !== 'Points' ? 0 : 1,
          brackets: subdivision.brackets.map((bracket) => ({
            name: bracket.name,
            number_of_teams: bracket.playoffTeams,
            matches: bracket.matches.map((match) => ({
              bottom_team: match.bottomTeam || '',
              top_team: match.topTeam || '',
              game_number: match.gameNumber || null,
              match_integer_id: match.id,
              is_not_first_round: match.isNotFirstRound || false,
              start_time: null,
              tournament_round_text: match.tournamentRoundText || '',
              next_match_id: match.nextMatchId,
              match_participants: match.participants
                .map((p) => ({
                  sub_division: p.subpoolName,
                  seed: p.seed,
                  is_empty: p.isEmpty,
                }))
                .filter((p) => p?.sub_division),
            })),
            subdivision: bracket.subdivisionsNames,
          })),
        })),
      })),
    }

    updateSeason({
      id: data!.id as string,
      body: editSeasonBody,
    }).then(() => {
      navigate(PATH_TO_SEASONS)
    })
  }

  const BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_SEASONS}>Seasons</a>,
    },
    {
      title: <MonroeBlueText>{data?.name}</MonroeBlueText>,
    },
  ]

  useEffect(() => {
    if (data && !selectedLeague) {
      setSelectedLeague(data.league.name)
    }
  }, [data])

  if (!data && isLoading) return <Loader />

  const initialValues: ICreateSeasonFormValues = {
    name: data?.name || '',
    expectedEndDate: data?.expectedEndDate || '',
    startDate: data?.startDate || '',
    league: data?.league?.id || '',
    divisions:
      data?.divisions.map((division) => ({
        id: division.id || '',
        name: division.name,
        description: division.description,
        subdivisions: division.sub_division.map((subdivision) => ({
          id: subdivision.id || '',
          name: subdivision.name,
          description: subdivision.description,
          playoffFormat: subdivision.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
          standingsFormat: subdivision.standings_format === 0 ? 'Winning %' : 'Points',
          tiebreakersFormat: subdivision.tiebreakers_format === 0 ? 'Winning %' : 'Points',
          brackets: subdivision.brackets.map((bracket) => ({
            name: bracket.name,
            subdivisionsNames: bracket.subdivision,
            playoffTeams: bracket.number_of_teams,
            matches: bracket.matches.map((match) => ({
              id: match.match_integer_id,
              nextMatchId: match.next_match_id,
              tournamentRoundText: match.tournament_round_text,
              state: 'SCHEDULED',
              isNotFirstRound: match.is_not_first_round,
              gameNumber: match.game_number,
              startTime: '-',
              topTeam: match.top_team,
              bottomTeam: match.bottom_team,
              participants: match.match_participants.map((p) => ({
                id: p.id || '',
                isEmpty: p.is_empty,
                subpoolName: p.sub_division,
                seed: p.seed,
              })),
              primaryId: match.id,
            })),
          })),
        })),
      })) || [],
  }

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Edit Season</title>
        </Helmet>

        <PageContainer vertical>
          <Breadcrumb items={BREAD_CRUMB_ITEMS} />

          <ProtectedPageTitle>Edit season</ProtectedPageTitle>

          <PageContent>
            <Formik
              initialValues={initialValues}
              validationSchema={seasonValidationSchema}
              onSubmit={handleSubmit}
              validateOnChange
              validateOnMount
            >
              {({ values, handleChange, handleSubmit, errors, setFieldValue }) => {
                const isEnabledButton = Object.keys(errors).length === 0
                const isAddSubdivisionBtnDisabled = !!errors.divisions?.length

                const collapsedDivisionItems = (removeFn: (index: number) => void) =>
                  values.divisions.map((division, idx) => ({
                    key: idx,
                    children: (
                      <CreateDivision
                        index={idx}
                        division={division}
                        errors={errors}
                        onChange={handleChange}
                        setFieldValue={setFieldValue}
                        removeFn={removeFn}
                        isMultipleDivisions={values.divisions.length > 1}
                        values={values}
                      />
                    ),
                    label: (
                      <Typography
                        style={{
                          color: '#1A1657',
                          fontSize: '16px',
                          fontWeight: 500,
                        }}
                      >
                        #{idx + 1} Division/Pool
                      </Typography>
                    ),
                  }))

                return (
                  <>
                    {!isCreateBracketPage && (
                      <Form onSubmit={handleSubmit}>
                        <Flex>
                          <div style={{ flex: '0 0 40%' }}>
                            <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                          </div>

                          <MainContainer>
                            <div style={{ marginBottom: '8px' }}>
                              <OptionTitle style={{ padding: '0 0 5px 0' }}>Name *</OptionTitle>
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
                                <OptionTitle>Linked League/Tourn *</OptionTitle>

                                <SearchLeagueTournament
                                  selectedLeague={selectedLeague}
                                  setSelectedLeague={(data) => {
                                    setFieldValue('league', data.id)
                                    setSelectedLeague(data.name)

                                    const updatedSubdivisions = values.divisions.map((division) => ({
                                      ...division,
                                      name: division.name,
                                      description: division.description,
                                      subdivisions: division.subdivisions.map((subdivision) => ({
                                        ...subdivision,
                                        name: subdivision.name,
                                        description: subdivision.description,
                                        playoffFormat: data.playoffFormat,
                                        standingsFormat: data.standingsFormat,
                                        tiebreakersFormat: data.tiebreakersFormat,
                                      })),
                                    }))

                                    setFieldValue('divisions', updatedSubdivisions)
                                  }}
                                />
                              </div>
                            </Flex>

                            <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                              <OptionTitle>Start Date *</OptionTitle>
                              <DatePicker
                                name="startDate"
                                value={dayjs(values.startDate, 'YYYY-MM-DD')}
                                onChange={(_, data) => {
                                  if (data) {
                                    setFieldValue('startDate', dayjs(data as string, 'YYYY-MM-DD'))
                                  } else {
                                    setFieldValue('startDate', null)
                                  }
                                }}
                                maxDate={dayjs(values.expectedEndDate, 'YYYY-MM-DD')}
                              />
                            </Flex>

                            <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                              <OptionTitle>Expected End Date *</OptionTitle>
                              <DatePicker
                                name="expectedEndDate"
                                value={dayjs(values.expectedEndDate, 'YYYY-MM-DD')}
                                onChange={(_, data) => {
                                  setFieldValue('expectedEndDate', dayjs(data as string, 'YYYY-MM-DD'))
                                }}
                                minDate={dayjs(values.startDate, 'YYYY-MM-DD')}
                              />
                            </Flex>
                          </MainContainer>
                        </Flex>

                        <MonroeDivider />

                        <Flex>
                          <Flex vertical style={{ flex: '0 0 40%' }}>
                            <ProtectedPageSubtitle>Division/Pool</ProtectedPageSubtitle>

                            <ProtectedPageSubtitleDescription>
                              Preselection for some settings is made based on the default settings of the linked
                              league/tournament.
                            </ProtectedPageSubtitleDescription>
                          </Flex>

                          <FieldArray name="divisions">
                            {({ push, remove }) => (
                              <Flex vertical>
                                <Accordion
                                  items={collapsedDivisionItems(remove)}
                                  expandIconPosition="end"
                                  defaultActiveKey={[0]}
                                  expandIcon={() => <ReactSVG src={ShowAllIcon} />}
                                  accordion
                                />

                                <div>
                                  <MonroeTooltip
                                    text={
                                      isAddSubdivisionBtnDisabled
                                        ? "You can't create division/pool when you have errors in other divisions/pools"
                                        : ''
                                    }
                                    arrowPosition="bottom"
                                    width="280px"
                                    containerWidth="190px"
                                  >
                                    <AddDivisionPollButton
                                      disabled={isAddSubdivisionBtnDisabled}
                                      type="default"
                                      icon={<PlusOutlined />}
                                      iconPosition="start"
                                      onClick={() => push(INITIAL_DIVISION_DATA)}
                                      style={{
                                        width: 'auto',
                                      }}
                                    >
                                      Add Division/Pool
                                    </AddDivisionPollButton>
                                  </MonroeTooltip>
                                </div>
                              </Flex>
                            )}
                          </FieldArray>

                          <div />
                        </Flex>

                        <MonroeDivider />

                        <Flex>
                          <div style={{ flex: '0 0 40%' }} />

                          <Flex style={{ width: '300px' }}>
                            <CancelButton type="default" onClick={goBack}>
                              Cancel
                            </CancelButton>

                            <MonroeTooltip
                              width="176px"
                              arrowPosition="bottom"
                              text={!isEnabledButton ? 'Missing mandatory data' : ''}
                            >
                              <MonroeButton
                                label="Edit Season"
                                type="primary"
                                onClick={handleSubmit}
                                isDisabled={!isEnabledButton}
                              />
                            </MonroeTooltip>
                          </Flex>
                        </Flex>
                      </Form>
                    )}

                    {isCreateBracketPage && <CreateBracket setFieldValue={setFieldValue} values={values} />}
                  </>
                )
              }}
            </Formik>
          </PageContent>
        </PageContainer>
      </>
    </BaseLayout>
  )
}

export default EditSeason
