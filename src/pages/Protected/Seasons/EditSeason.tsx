import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Breadcrumb, DatePicker, Flex } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Helmet } from 'react-helmet'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import CreateBracket from '@/pages/Protected/Seasons/CreateBracket/CreateBracket'
import CreateDivision from '@/pages/Protected/Seasons/components/CreateDivision'
import SearchLeagueTournament from '@/pages/Protected/Seasons/components/SearchLeagueTournament'
import {
  ICreateSeasonFormValues,
  INITIAL_DIVISION_DATA,
  seasonValidationSchema,
} from '@/pages/Protected/Seasons/constants/formik'

import { AccordionHeader, AddEntityButton, MainContainer } from '@/components/Elements'
import {
  Accordion,
  CancelButton,
  MonroeBlueText,
  MonroeDivider,
  MonroeSecondaryButton,
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
import MonroeModal from '@/components/MonroeModal'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useAuthSlice } from '@/redux/hooks/useAuthSlice'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useGetSeasonDetailsQuery, useUpdateSeasonMutation } from '@/redux/seasons/seasons.api'

import { PATH_TO_EDIT_SEASON, PATH_TO_SEASONS } from '@/constants/paths'

import { ICreateBESeason } from '@/common/interfaces/season'

import FileExcel from '@/assets/icons/file-exel.svg'
import ShowAllIcon from '@/assets/icons/show-all.svg'
import SwapIcon from '@/assets/icons/swap.svg'

const EditSeason = () => {
  const params = useParams<{ id: string }>()
  const { data, currentData, isFetching, isLoading } = useGetSeasonDetailsQuery(params!.id || '', {
    skip: !params.id,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })
  const navigate = useNavigate()
  const [updateSeason] = useUpdateSeasonMutation()
  const location = useLocation()
  const [selectedLeague, setSelectedLeague] = useState<string | undefined>(data?.league?.name)
  const { isCreateBracketPage, setIsCreateBracketPage, setSelectedBracketId, selectedBracketId, isDuplicateNames } =
    useSeasonSlice()
  const isEditPage = location.pathname.includes(PATH_TO_EDIT_SEASON)
  const [showModal, setShowModal] = useState(false)
  const { access } = useAuthSlice()
  const { setAppNotification } = useAppSlice()

  const INITIAL_BREAD_CRUMB_ITEMS = [
    {
      title: <a href={PATH_TO_SEASONS}>Seasons</a>,
    },
    {
      title: <MonroeBlueText>{data?.name}</MonroeBlueText>,
    },
  ]

  const BREAD_CRUMB_ITEMS = isCreateBracketPage
    ? [
        {
          title: (
            <a
              href={PATH_TO_SEASONS}
              onClick={() => {
                setIsCreateBracketPage(false)
                setSelectedBracketId(null)
              }}
            >
              Seasons
            </a>
          ),
        },
        {
          title: (
            <a
              onClick={() => {
                setIsCreateBracketPage(false)
                setSelectedBracketId(null)
              }}
            >
              {data?.name}
            </a>
          ),
        },
        {
          title: <MonroeBlueText>Edit Bracket</MonroeBlueText>,
        },
      ]
    : INITIAL_BREAD_CRUMB_ITEMS

  useEffect(() => {
    if (data && !selectedLeague) setSelectedLeague(data.league.name)
  }, [data])

  const handleExport = async () => {
    if (selectedBracketId) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}teams/seasons/export-bracket`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedBracketId,
        }),
      })
      const fileData = await response.blob()

      if (!fileData) return

      let bracketName = 'bracket'

      currentData?.divisions.map((div) =>
        div.sub_division.map((subDiv) =>
          subDiv.brackets?.map((bracket) => {
            if (bracket.id === selectedBracketId) {
              bracketName = bracket.name
            }
          }),
        ),
      )

      const blob = new Blob([fileData], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${bracketName}.xlsx`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handlePopulateBrackets = async (values: ICreateSeasonFormValues) => {
    const editSeasonBody: ICreateBESeason = {
      name: values.name,
      league_id: values.league,
      start_date: format(new Date(values.startDate as unknown as string), 'yyyy-MM-dd'),
      expected_end_date: format(new Date(values.expectedEndDate as unknown as string), 'yyyy-MM-dd'),
      divisions: values.divisions.map((division) => ({
        name: division.name,
        description: division.description,
        sub_division: division.subdivisions.map((subdivision) => ({
          name: subdivision.name,
          description: subdivision.description,
          playoff_format: subdivision.playoffFormat === 'Best Record Wins' ? 0 : 1,
          standings_format: subdivision.standingsFormat !== 'Points' ? 0 : 1,
          tiebreakers_format: subdivision.tiebreakersFormat !== 'Points' ? 0 : 1,
          changed: subdivision.changed,
          brackets: subdivision.brackets.map((bracket) => ({
            id: bracket.id as number,
            name: bracket.name,
            number_of_teams: bracket.playoffTeams,
            published: true,
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

    // TODO: handle modal behavior

    setShowModal(true)

    updateSeason({
      id: data!.id as string,
      body: editSeasonBody,
    }).then(() => {
      setAppNotification({
        message: 'Bracket successfully populated',
        timestamp: new Date().getTime(),
        type: 'success',
      })
    })
  }

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
          changed: subdivision.changed ? subdivision.playoffFormat === 'Best Record Wins' : false,
          brackets: subdivision.brackets.map((bracket) => ({
            id: bracket.id as number,
            name: bracket.name,
            number_of_teams: bracket.playoffTeams,
            published: false,
            matches: bracket.matches.map((match) => ({
              id: match.primaryId,
              bottom_team: match.bottomTeam || '',
              top_team: match.topTeam || '',
              game_number: match.gameNumber || null,
              match_integer_id: match.id,
              is_not_first_round: match.isNotFirstRound || false,
              start_time: null,
              tournament_round_text: match.tournamentRoundText || '',
              next_match_id: match.nextMatchId,
              match_participants: match.participants
                .map((p) =>
                  p.id.length > 2
                    ? {
                        id: p.id.length > 2 ? p.id : '',
                        sub_division: p.subpoolName,
                        seed: p.seed,
                        is_empty: p.isEmpty,
                      }
                    : {
                        sub_division: p.subpoolName,
                        seed: p.seed,
                        is_empty: p.isEmpty,
                      },
                )
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

  if (!data && (isLoading || isFetching)) return <Loader />

  const initialValues: ICreateSeasonFormValues = {
    name: currentData?.name || '',
    expectedEndDate: currentData?.expectedEndDate || '',
    startDate: currentData?.startDate || '',
    league: currentData?.league?.id || '',
    divisions:
      currentData?.divisions.map((division) => ({
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
          changed: subdivision.changed,
          brackets: subdivision!.brackets!.map((bracket) => ({
            id: bracket.id,
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

        {showModal &&
          createPortal(
            <MonroeModal
              okText="Confirm"
              onOk={() => {
                setShowModal(false)
              }}
              onCancel={() => {
                setShowModal(false)
              }}
              title="Playoff phase is not ready"
              type="warn"
              content={
                <p>
                  It seems that there is at least one Game with Scores pending to be added and this might impact on
                  Teams placed on the Brackets. You may proceed, but reviewing it is advisable.
                </p>
              }
            />,
            document.body,
          )}

        <Formik
          initialValues={initialValues}
          validationSchema={seasonValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnMount
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue }) => {
            const isEnabledButton = Object.keys(errors).length === 0 && !isDuplicateNames
            const isAddSubdivisionBtnDisabled = !!errors.divisions?.length || isDuplicateNames

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
                label: <AccordionHeader>#{idx + 1} Division/Pool</AccordionHeader>,
              }))

            return (
              <>
                <PageContainer vertical>
                  <Breadcrumb items={BREAD_CRUMB_ITEMS} />

                  <Flex align="center" justify="space-between">
                    <ProtectedPageTitle>Edit season</ProtectedPageTitle>

                    {isEditPage && isCreateBracketPage && selectedBracketId && (
                      <Flex>
                        <MonroeSecondaryButton
                          icon={<ReactSVG src={FileExcel} />}
                          iconPosition="start"
                          type="default"
                          onClick={handleExport}
                        >
                          Export Playoff Template CSV
                        </MonroeSecondaryButton>

                        <MonroeButton
                          label="Populate Brackets"
                          iconPosition="start"
                          isDisabled
                          icon={<ReactSVG src={SwapIcon} />}
                          type="primary"
                          style={{ height: '32px' }}
                          onClick={() => handlePopulateBrackets(values)}
                        />
                      </Flex>
                    )}
                  </Flex>
                  <PageContent>
                    {!isCreateBracketPage && (
                      <Form onSubmit={handleSubmit}>
                        <Flex style={{ padding: '0' }}>
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
                                onChange={(_: unknown, data: string | string[]) => {
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
                                onChange={(_: unknown, data: string | string[]) => {
                                  if (data) {
                                    setFieldValue('expectedEndDate', dayjs(data as string, 'YYYY-MM-DD'))
                                  } else {
                                    setFieldValue('expectedEndDate', null)
                                  }
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
                                    width="280px"
                                    containerWidth="190px"
                                  >
                                    <AddEntityButton
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
                                    </AddEntityButton>
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

                          <Flex>
                            <CancelButton type="default" onClick={goBack}>
                              Cancel
                            </CancelButton>

                            <MonroeTooltip width="176px" text={!isEnabledButton ? 'Missing mandatory data' : ''}>
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
                  </PageContent>
                </PageContainer>
              </>
            )
          }}
        </Formik>
      </>
    </BaseLayout>
  )
}

export default EditSeason
