import { useEffect, useState } from 'react'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { Page } from '@/layouts/Page'
import { SeasonForm } from '@/pages/Protected/Seasons/components/SeasonForm'
import { SeasonFormProvider } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormProvider.tsx'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import { IBECreateSeasonBody } from '@/common/interfaces/season.ts'
import { format } from 'date-fns'
import { BEST_RECORD_WINS, POINTS, SINGLE_ELIMINATION_BRACKET, WINNING } from '@/common/constants/league.ts'
import { PATH_TO_SEASONS } from '@/common/constants/paths.ts'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useBulkDeleteBracketsMutation,
  useGetSeasonDetailsQuery,
  useUpdateSeasonMutation
} from '@/redux/seasons/seasons.api.ts'
import Loader from '@/components/Loader.tsx'
import { MonroeBlueText } from '@/components/Elements'
import { useNotification } from '@/hooks/useNotification.ts'
import { SeasonFormControls } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormControls.tsx'


const EditSeason = () => {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  const [bulkBracketDelete] = useBulkDeleteBracketsMutation()

  const {notify} = useNotification()
  const { selectedLeague } = useSeasonSlice()
  const { data, currentData, isFetching, isLoading } = useGetSeasonDetailsQuery(params!.id || '', {
    skip: !params.id,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  })

  const {
    setIsCreateBracketPage,
    setSelectedBracketId,
    setSelectedLeague
  } = useSeasonSlice()

  const [updateSeason, { isLoading: isUpdating }] = useUpdateSeasonMutation()
  const [selectedLeagueTournament, setSelectedLeagueTournament] = useState<string | undefined>('')

  useEffect(() => {
    setIsCreateBracketPage(false)
    setSelectedBracketId(null)
    if (selectedLeague && !selectedLeagueTournament) setSelectedLeagueTournament(selectedLeague.name)

    setSelectedLeague(null)
  }, [])

  const goBack = () => navigate(PATH_TO_SEASONS)

  const onSubmit = async (values: ICreateSeasonFormValues, ids: number[]) => {
    const editSeasonBody: IBECreateSeasonBody = {
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
            match_integer_id: match.matchIntegerId!,
            top_team: match?.topTeam || '',
            bottom_team: match?.bottomTeam || '',
            next_match_id: match.nextMatchId,
            tournament_round_text: match?.tournamentRoundText || '',
            is_not_first_round: !!match.isNotFirstRound,
            game_number: match.gameNumber || null,
            stage: match.stage,
            match_participants: match.matchParticipants?.map((participant) => ({
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

    if (ids.length > 0) {
      await bulkBracketDelete(ids)
        .unwrap()
        .then(() => {
          updateSeason({
            id: data!.id as string,
            body: editSeasonBody
          })
            .unwrap()
            .then(() => {
              navigate(PATH_TO_SEASONS)
            })
        })
        .catch(() => {
          notify(`Can't delete bracket/bracket's. Please try again later`, 'error')
        })
    } else {
      updateSeason({
        id: data!.id as string,
        body: editSeasonBody
      })
        .unwrap()
        .then(() => {
          navigate(PATH_TO_SEASONS)
        })
        .catch(() => {
        })
    }
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
        playoffFormat: division.playoffFormat === 0 ? BEST_RECORD_WINS : SINGLE_ELIMINATION_BRACKET,
        brackets: division.brackets?.map((bracket) => ({
          id: bracket.id,
          name: bracket.name,
          subdivisionsNames: [...bracket.subDivision || [], ...(division.subDivision?.map(subdivision => subdivision.name))  || []],
          playoffTeams: bracket.numberOfTeams,
          matches: bracket.matches.map((match) => ({
            id: match.matchIntegerId!,
            matchIntegerId: match.matchIntegerId,
            nextMatchId: match.nextMatchId,
            tournamentRoundText: match.tournamentRoundText,
            state: 'SCHEDULED',
            isNotFirstRound: match.isNotFirstRound,
            gameNumber: match.gameNumber,
            startTime: '-',
            topTeam: match.topTeam,
            bottomTeam: match.bottomTeam,
            matchParticipants: match.matchParticipants?.map((p) => {
              return ({
                id: p.id || '',
                isEmpty: p.is_empty,
                subDivision: p.sub_division,
                seed: p.seed
              })
            }) || [],
            primaryId: match.id
          }))
        })) || [],
        subDivisions: division.subDivision?.map((subdivision) => ({
          id: subdivision.id || '',
          name: subdivision.name,
          description: subdivision.description,
          standingsFormat: subdivision.standingsFormat === 0 ? WINNING : POINTS,
          tiebreakersFormat: subdivision.tiebreakersFormat === 0 ? WINNING : POINTS,
          changed: subdivision.changed,
        })) || []
      })) || []
  }

  const BREAD_CRUMB_ITEMS = [
    { title: <a href={PATH_TO_SEASONS}>Seasons</a> },
    { title: <MonroeBlueText>{data?.name}</MonroeBlueText> }
  ]

  return (
    <SeasonFormProvider mustValidate={true}>
      <Page
        title="Edit Season"
        breadcrumbs={BREAD_CRUMB_ITEMS}
        controls={() => <SeasonFormControls />}
      >
        <SeasonForm
          title="Edit Season"
          validateOnMount
          breadcrumbs={BREAD_CRUMB_ITEMS}
          initialValues={initialValues}
          isLoading={isUpdating}
          onSubmit={onSubmit}
          goBack={goBack}
        />
      </Page>
    </SeasonFormProvider>
  )
}

export default EditSeason
