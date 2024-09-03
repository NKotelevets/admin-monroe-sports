import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Breadcrumb, Flex } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import CreateBracket from '@/pages/Protected/Seasons/CreateBracket/CreateBracket'
import CreateDivision from '@/pages/Protected/Seasons/components/CreateDivision'
import SearchLeagueTournament from '@/pages/Protected/Seasons/components/SearchLeagueTournament'
import {
  ICreateSeasonFormValues,
  INITIAL_DIVISION_DATA,
  seasonInitialFormValues,
  seasonValidationSchema,
} from '@/pages/Protected/Seasons/constants/formik'

import { AccordionHeader, AddEntityButton, MainContainer } from '@/components/Elements'
import {
  Accordion,
  CancelButton,
  MonroeBlueText,
  MonroeDatePicker,
  MonroeDivider,
  OptionTitle,
  PageContainer,
  PageContent,
  ProtectedPageSubtitle,
  ProtectedPageSubtitleDescription,
  ProtectedPageTitle,
} from '@/components/Elements'
import { InputError } from '@/components/Inputs/InputElements'
import MonroeInput from '@/components/Inputs/MonroeInput'
import MonroeButton from '@/components/MonroeButton'
import MonroeTooltip from '@/components/MonroeTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useCreateSeasonMutation } from '@/redux/seasons/seasons.api'

import { PATH_TO_SEASONS } from '@/constants/paths'

import { IBECreateSeasonBody } from '@/common/interfaces/season'

import ShowAllIcon from '@/assets/icons/show-all.svg'

const INITIAL_BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_SEASONS}>Seasons</a>,
  },
  {
    title: <MonroeBlueText>Create season</MonroeBlueText>,
  },
]

const CreateSeason = () => {
  const navigate = useNavigate()
  const { selectedLeague, isDuplicateNames } = useSeasonSlice()
  const [selectedLeagueTournament, setSelectedLeagueTournament] = useState<string | undefined>('')
  const [createSeason] = useCreateSeasonMutation()
  const { isCreateBracketPage, setIsCreateBracketPage, setSelectedBracketId, setSelectedLeague } = useSeasonSlice()

  useEffect(() => {
    setIsCreateBracketPage(false)
    setSelectedBracketId(null)
    if (selectedLeague && !selectedLeagueTournament) setSelectedLeagueTournament(selectedLeague.name)

    setSelectedLeague(null)
  }, [])

  const goBack = useCallback(() => navigate(PATH_TO_SEASONS), [])

  const handleSubmit = (values: ICreateSeasonFormValues) => {
    const createSeasonBody: IBECreateSeasonBody = {
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
          brackets: subdivision?.brackets?.map((bracket) => ({
            name: bracket.name,
            number_of_teams: bracket.playoffTeams,
            subdivision: bracket.subdivisionsNames,
            published: false,
            matches: bracket.matches.map((match) => ({
              top_team: match?.topTeam || '',
              bottom_team: match?.bottomTeam || '',
              next_match_id: match.nextMatchId,
              tournament_round_text: match?.tournamentRoundText || '',
              is_not_first_round: match.isNotFirstRound,
              game_number: match.gameNumber || null,
              match_integer_id: match.id,
              match_participants: match.participants
                .map((participant) => ({
                  sub_division: participant.subpoolName,
                  seed: participant.seed,
                  is_empty: participant.isEmpty,
                }))
                .filter((p) => p?.sub_division),
            })),
          })),
        })),
      })),
    }

    createSeason(createSeasonBody)
      .unwrap()
      .then(() => {
        navigate(PATH_TO_SEASONS)
      })

    setSelectedLeague(null)
  }

  const initialValues: ICreateSeasonFormValues = selectedLeague
    ? {
        ...seasonInitialFormValues,
        league: selectedLeague.id,
      }
    : seasonInitialFormValues

  const BREAD_CRUMB_ITEMS = isCreateBracketPage
    ? [
        {
          title: <a href={PATH_TO_SEASONS}>Seasons</a>,
        },
        {
          title: (
            <a
              onClick={() => {
                setIsCreateBracketPage(false)
                setSelectedBracketId(null)
              }}
            >
              Create season
            </a>
          ),
        },
        {
          title: <MonroeBlueText>Create Bracket</MonroeBlueText>,
        },
      ]
    : INITIAL_BREAD_CRUMB_ITEMS

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Create Season</title>
        </Helmet>

        <Formik
          initialValues={initialValues}
          validationSchema={seasonValidationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur
          validateOnMount
        >
          {({ values, handleChange, handleSubmit, errors, setFieldValue, validateField, setFieldError }) => {
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
              <Form onSubmit={handleSubmit}>
                <PageContainer vertical>
                  <Breadcrumb items={BREAD_CRUMB_ITEMS} />

                  <ProtectedPageTitle>Create season</ProtectedPageTitle>
                  {isCreateBracketPage && (
                    <PageContent>
                      <CreateBracket setFieldValue={setFieldValue} values={values} />
                    </PageContent>
                  )}

                  {!isCreateBracketPage && (
                    <PageContent>
                      <Flex>
                        <div style={{ flex: '0 0 40%' }}>
                          <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                        </div>

                        <MainContainer>
                          <div style={{ marginBottom: '8px' }}>
                            <MonroeInput
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              placeholder="Enter season"
                              style={{ height: '32px' }}
                              label={<OptionTitle style={{ padding: '0 0 5px 0' }}>Name *</OptionTitle>}
                              error={errors.name}
                              onBlur={() => validateField('name')}
                            />
                          </div>

                          <Flex vertical justify="flex-start">
                            <div style={{ marginBottom: '8px' }}>
                              <Flex align="center" justify="space-between">
                                <OptionTitle>Linked League/Tourn *</OptionTitle>

                                {errors.league && <InputError>{errors.league}</InputError>}
                              </Flex>

                              <SearchLeagueTournament
                                selectedLeague={selectedLeagueTournament}
                                isError={!!errors.league}
                                onBlur={() => validateField('league')}
                                setFieldError={setFieldError}
                                setSelectedLeague={(data) => {
                                  setFieldValue('league', data.id)

                                  const updatedSubdivisions = values.divisions.map((division) => ({
                                    name: division.name,
                                    description: division.description,
                                    subdivisions: division.subdivisions.map((subdivision) => ({
                                      name: subdivision.name,
                                      description: subdivision.description,
                                      playoffFormat: data.playoffFormat,
                                      standingsFormat: data.standingsFormat,
                                      tiebreakersFormat: data.tiebreakersFormat,
                                    })),
                                  }))

                                  setFieldValue('divisions', updatedSubdivisions)

                                  setSelectedLeagueTournament(data.name)

                                  validateField('league')
                                }}
                              />
                            </div>
                          </Flex>

                          <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                            <Flex align="center" justify="space-between">
                              <OptionTitle>Start Date *</OptionTitle>

                              {errors.startDate && <InputError>{errors.startDate}</InputError>}
                            </Flex>

                            <MonroeDatePicker
                              name="startDate"
                              value={values.startDate}
                              is_error={`${!!errors.startDate}`}
                              onChange={(_: unknown, data: string | string[]) => {
                                if (data) {
                                  setFieldValue('startDate', dayjs(data as string, 'YYYY-MM-DD'))
                                } else {
                                  setFieldValue('startDate', null)
                                }
                              }}
                              maxDate={values.expectedEndDate as unknown as dayjs.Dayjs}
                              onBlur={() => validateField('startDate')}
                            />
                          </Flex>

                          <Flex vertical justify="flex-start" style={{ marginBottom: '8px', width: '100%' }}>
                            <Flex align="center" justify="space-between">
                              <OptionTitle>Expected End Date *</OptionTitle>
                              {errors.expectedEndDate && <InputError>{errors.expectedEndDate}</InputError>}
                            </Flex>

                            <MonroeDatePicker
                              is_error={`${!!errors.expectedEndDate}`}
                              name="expectedEndDate"
                              value={values.expectedEndDate}
                              onChange={(_: unknown, data: string | string[]) => {
                                if (data) {
                                  setFieldValue('expectedEndDate', dayjs(data as string, 'YYYY-MM-DD'))
                                } else {
                                  setFieldValue('expectedEndDate', null)
                                }
                              }}
                              minDate={values.startDate as unknown as dayjs.Dayjs}
                              onBlur={() => validateField('expectedEndDate')}
                            />
                          </Flex>
                        </MainContainer>
                      </Flex>

                      <MonroeDivider
                        style={{
                          margin: '24px 0 12px 0',
                        }}
                      />

                      <Flex>
                        <Flex vertical style={{ flex: '0 0 40%', paddingTop: '12px' }}>
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

                              <MonroeTooltip
                                text={
                                  isAddSubdivisionBtnDisabled
                                    ? "You can't create division/pool when you have errors in other divisions/pools"
                                    : ''
                                }
                                width="220px"
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
                            </Flex>
                          )}
                        </FieldArray>
                      </Flex>

                      <MonroeDivider />

                      <Flex>
                        <div style={{ flex: '0 0 40%' }} />
                        <Flex>
                          <CancelButton type="default" onClick={goBack}>
                            Cancel
                          </CancelButton>

                          <MonroeTooltip width="179px" text={!isEnabledButton ? 'Missing mandatory data' : ''}>
                            <MonroeButton
                              label="Create Season"
                              type="primary"
                              onClick={handleSubmit}
                              isDisabled={!isEnabledButton}
                            />
                          </MonroeTooltip>
                        </Flex>
                      </Flex>
                    </PageContent>
                  )}
                </PageContainer>
              </Form>
            )
          }}
        </Formik>
      </>
    </BaseLayout>
  )
}

export default CreateSeason
