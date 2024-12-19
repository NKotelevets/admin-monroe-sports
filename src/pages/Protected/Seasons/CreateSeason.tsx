import { useEffect, useMemo, useState } from 'react'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { Page } from '@/layouts/Page'
import { SeasonForm } from '@/pages/Protected/Seasons/components/SeasonForm'
import { SeasonFormProvider } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormProvider.tsx'
import { BREAD_CRUMB_ITEMS } from '@/common/constants/seasons.tsx'
import { ICreateSeasonFormValues, seasonInitialFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import { IBECreateSeasonBody } from '@/common/interfaces/season.ts'
import { format } from 'date-fns'
import { BEST_RECORD_WINS, POINTS } from '@/common/constants/league.ts'
import { PATH_TO_SEASONS } from '@/common/constants/paths.ts'
import { useNavigate } from 'react-router-dom'
import { useCreateSeasonMutation } from '@/redux/seasons/seasons.api.ts'

const CreateSeason = () => {
  const navigate = useNavigate()

  const { selectedLeague } = useSeasonSlice()
  const {
    setIsCreateBracketPage,
    setSelectedBracketId,
    setSelectedLeague
  } = useSeasonSlice()

  const [createSeason, { isLoading }] = useCreateSeasonMutation()
  const [selectedLeagueTournament, setSelectedLeagueTournament] = useState<string | undefined>('')

  useEffect(() => {
    setIsCreateBracketPage(false)
    setSelectedBracketId(null)
    if (selectedLeague && !selectedLeagueTournament) setSelectedLeagueTournament(selectedLeague.name)

    setSelectedLeague(null)
  }, [])

  const goBack = () => navigate(PATH_TO_SEASONS)

  const onSubmit = (values: ICreateSeasonFormValues) => {
    const createSeasonBody: IBECreateSeasonBody = {
      name: values.name,
      league_id: values.league!,
      start_date: format(new Date(values.startDate as unknown as string), 'yyyy-MM-dd'),
      expected_end_date: format(new Date(values.expectedEndDate as unknown as string), 'yyyy-MM-dd'),
      divisions: values.divisions.map((division) => ({
        name: division.name,
        description: division.description,
        playoff_format: division.playoffFormat === BEST_RECORD_WINS ? 0 : 1,
        brackets: division?.brackets?.map((bracket) => ({
          name: bracket.name,
          number_of_teams: bracket.playoffTeams,
          subdivision: bracket.subdivisionsNames,
          published: false,
          matches: bracket.matches.map((match) => ({
            top_team: match?.topTeam || '',
            bottom_team: match?.bottomTeam || '',
            next_match_id: match.nextMatchId,
            tournament_round_text: match?.tournamentRoundText || '',
            is_not_first_round: !!match.isNotFirstRound,
            game_number: match.gameNumber || null,
            match_integer_id: match.id,
            stage: match.stage,
            match_participants: match.matchParticipants
              .map((participant) => ({
                sub_division: participant.subDivision,
                seed: participant.seed,
                is_empty: participant.isEmpty
              }))
              .filter((p) => p?.sub_division)
          }))
        })),
        sub_division: division.subDivisions.map((subdivision) => ({
          name: subdivision.name,
          description: subdivision.description,
          standings_format: subdivision.standingsFormat !== POINTS ? 0 : 1,
          tiebreakers_format: subdivision.tiebreakersFormat !== POINTS ? 0 : 1
        }))
      }))
    }

    createSeason(createSeasonBody)
      .unwrap()
      .then(() => navigate(PATH_TO_SEASONS))

    setSelectedLeague(null)
  }

  const initialValues: ICreateSeasonFormValues = useMemo(() => {
    if (!selectedLeague)
      return seasonInitialFormValues

    return { ...seasonInitialFormValues, league: selectedLeague.id }
  }, [selectedLeague])

  return (
    <SeasonFormProvider>
      <Page
        title="Create Season"
        breadcrumbs={BREAD_CRUMB_ITEMS}
      >
        <SeasonForm
          title="Create Season"
          breadcrumbs={BREAD_CRUMB_ITEMS}
          initialValues={initialValues}
          isLoading={isLoading}
          onSubmit={onSubmit}
          goBack={goBack}
        />
      </Page>
    </SeasonFormProvider>
  )
}

export default CreateSeason
