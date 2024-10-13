import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Breadcrumb, Flex } from 'antd'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
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

import { BEST_RECORD_WINS, POINTS } from '@/common/constants/league'
import { PATH_TO_SEASONS } from '@/common/constants/paths'
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

  const handleSubmit = async (
    values: ICreateSeasonFormValues,
    formikHelpers: FormikHelpers<ICreateSeasonFormValues>,
  ) => {
    const result = await formikHelpers.validateForm(values)

    if (Object.keys(result).length || isDuplicateNames) return

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
          playoff_format: subdivision.playoffFormat === BEST_RECORD_WINS ? 0 : 1,
          standings_format: subdivision.standingsFormat !== POINTS ? 0 : 1,
          tiebreakers_format: subdivision.tiebreakersFormat !== POINTS ? 0 : 1,
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
              stage: match.stage,
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
      .then(() => navigate(PATH_TO_SEASONS))

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
          {({
            values,
            handleChange,
            handleSubmit,
            errors,
            setFieldValue,
            validateField,
            setFieldError,
            handleBlur,
            touched,
            setTouched,
            setFieldTouched,
          }) => {
            const isAddDivisionBtnDisabled = !!errors.divisions?.length || isDuplicateNames
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
                    touched={touched}
                    handleBlur={handleBlur}
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
                      <CreateBracket
                        setFieldValue={setFieldValue}
                        values={values}
                        handleBlur={handleBlur}
                        touched={touched}
                        setFieldTouched={setFieldTouched}
                      />
                    </PageContent>
                  )}

                  {!isCreateBracketPage && (
                    <PageContent>
                      <Flex>
                        <div className="f-40">
                          <ProtectedPageSubtitle>Main Info</ProtectedPageSubtitle>
                        </div>

                        <MainContainer>
                          <div className="mg-b8">
                            <MonroeInput
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              placeholder="Enter season"
                              className="h-32"
                              label={<OptionTitle className="pb-5">Name *</OptionTitle>}
                              error={touched.name ? errors.name : ''}
                              onBlur={handleBlur}
                            />
                          </div>

                          <Flex vertical justify="flex-start">
                            <div className="mg-b8">
                              <Flex align="center" justify="space-between">
                                <OptionTitle>Linked League/Tourn *</OptionTitle>

                                {touched.league && errors.league && <InputError>{errors.league}</InputError>}
                              </Flex>

                              <SearchLeagueTournament
                                selectedLeague={selectedLeagueTournament}
                                isError={touched.league ? !!errors.league : false}
                                onBlur={() => {
                                  setTouched({ ...touched, league: true })
                                  validateField('league')
                                }}
                                setFieldError={setFieldError}
                                setSelectedLeague={(data) => {
                                  setFieldValue('league', data.id)
                                  setTouched({ ...touched, league: true })

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
                                }}
                              />
                            </div>
                          </Flex>

                          <Flex vertical justify="flex-start" className="mg-b8 w-full">
                            <Flex align="center" justify="space-between">
                              <OptionTitle>Start Date *</OptionTitle>

                              {touched.startDate && errors.startDate && <InputError>{errors.startDate}</InputError>}
                            </Flex>

                            <MonroeDatePicker
                              name="startDate"
                              value={values.startDate}
                              is_error={`${touched.startDate ? !!errors.startDate : false}`}
                              onChange={(_: unknown, data: string | string[]) => {
                                setTouched({ ...touched, startDate: true })

                                if (data) {
                                  setFieldValue('startDate', dayjs(data as string, 'YYYY-MM-DD'))
                                  setFieldError('startDate', '')
                                } else {
                                  setFieldValue('startDate', null)
                                  setFieldError('startDate', 'Start Date is required')
                                }
                              }}
                              maxDate={values.expectedEndDate as unknown as dayjs.Dayjs}
                              onBlur={() => {
                                setTouched({ ...touched, startDate: true })
                                validateField('startDate')
                              }}
                            />
                          </Flex>

                          <Flex vertical justify="flex-start" className="mg-b8 w-full">
                            <Flex align="center" justify="space-between">
                              <OptionTitle>Expected End Date *</OptionTitle>
                              {touched.expectedEndDate && errors.expectedEndDate && (
                                <InputError>{errors.expectedEndDate}</InputError>
                              )}
                            </Flex>

                            <MonroeDatePicker
                              is_error={`${touched.expectedEndDate ? !!errors.expectedEndDate : false}`}
                              name="expectedEndDate"
                              value={values.expectedEndDate}
                              onChange={(_: unknown, data: string | string[]) => {
                                setTouched({ ...touched, expectedEndDate: true })

                                if (data) {
                                  setFieldValue('expectedEndDate', dayjs(data as string, 'YYYY-MM-DD'))
                                  setFieldError('expectedEndDate', '')
                                } else {
                                  setFieldValue('expectedEndDate', null)
                                  setFieldError('expectedEndDate', 'Expected End Date is required')
                                }
                              }}
                              minDate={values.startDate as unknown as dayjs.Dayjs}
                              onBlur={() => {
                                setTouched({ ...touched, expectedEndDate: true })
                                validateField('expectedEndDate')
                              }}
                            />
                          </Flex>
                        </MainContainer>
                      </Flex>

                      <MonroeDivider className="mg-v24" />

                      <Flex>
                        <Flex className="f-40 pt-12" vertical>
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
                                  isAddDivisionBtnDisabled
                                    ? "You can't create division/pool when you have errors in other divisions/pools"
                                    : ''
                                }
                                width="220px"
                                containerWidth="190px"
                              >
                                <AddEntityButton
                                  disabled={isAddDivisionBtnDisabled}
                                  type="default"
                                  icon={<PlusOutlined />}
                                  iconPosition="start"
                                  onClick={() => push(INITIAL_DIVISION_DATA)}
                                  className="w-auto"
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
                        <div className="f-40" />
                        <Flex>
                          <CancelButton type="default" onClick={goBack}>
                            Cancel
                          </CancelButton>

                          <MonroeButton label="Create Season" type="primary" onClick={handleSubmit} />
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
