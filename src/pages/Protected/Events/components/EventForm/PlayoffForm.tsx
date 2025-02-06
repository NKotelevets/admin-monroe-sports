import styled from '@emotion/styled'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'

import { VS } from '@/pages/Protected/Events/components/VS.tsx'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'

import { Box } from '@/components/Elements'
import { FormSummary } from '@/components/FormSummary.tsx'

import { IMatch } from '@/common/interfaces/bracket.ts'
import { IEventForm } from '@/common/interfaces/event.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'

const EMPTY_BRACKET = 'Bracket not populated yet.'

export const PlayoffForm = () => {
  const { values } = useFormikContext<IEventForm>()
  const { divisionsAvailable } = useEventFormContext()

  const [currentGame, setCurrentGame] = useState<IMatch | null>(null)

  useEffect(() => {
    if (!values.game) return

    const find = divisionsAvailable
      ?.flatMap((division) => division.brackets)
      ?.flatMap((bracket) => bracket.matches)
      ?.find((match) => match.gameNumber === values.game)

    if (!find) return

    setCurrentGame(find)
  }, [divisionsAvailable, values.game])

  const team1Name = getTeamName(1, currentGame?.topTeam)
  const team2Name = getTeamName(2, currentGame?.bottomTeam)
  const team1CoachName = getTeamCoachName(currentGame?.topTeam)
  const team2CoachName = getTeamCoachName(currentGame?.bottomTeam)

  return (
    <>
      <BoxStyled showForm={true} direction="vertical" error={false}>
        <FormSummary error={false} title={team1Name} subtitle={team1CoachName} />
      </BoxStyled>
      <VS />
      <TeamTwo showForm={true} direction="vertical" error={false}>
        <FormSummary error={false} title={team2Name} subtitle={team2CoachName} />
      </TeamTwo>
    </>
  )
}

/**
 * Retrieves the name of the team based on the provided team number and optional team information.
 *
 * If a string is passed as the team parameter, it is returned as the team name.
 * If no valid name is found in the team object, a default name in the format `Team {teamNumber}` is returned.
 *
 * @param {number} teamNumber - The number of the team.
 * @param {string | IFELeagueTeam} [team] - Optional team information, either as a string or an object implementing IFELeagueTeam.
 * @return {string} The name of the team.
 */
const getTeamName = (teamNumber: number, team?: string | IFELeagueTeam): string => {
  if (typeof team === 'string') return team || `Team ${teamNumber}`
  if (!team?.name) return `Team ${teamNumber}`
  return team.name
}

/**
 * Retrieves the name of the team coach based on the provided team information.
 *
 * If the input is a string, it returns the string or a default placeholder.
 * If the input is an object representing a team, it returns the coach's full name
 * or a default placeholder if no coach is available.
 *
 * @param {string|IFELeagueTeam} [team] - The team information or team object.
 * @returns {string} The coach's full name, a placeholder, or an empty value, depending on input.
 */
const getTeamCoachName = (team?: string | IFELeagueTeam): string => {
  if (typeof team === 'string') return team || EMPTY_BRACKET
  if (!team?.headCoach) return EMPTY_BRACKET
  return `${team.headCoach.firstName} ${team.headCoach.lastName}` || EMPTY_BRACKET
}

// Styled Components
const BoxStyled = styled(Box)`
  margin-bottom: 24px;
  cursor: unset;
`
const TeamTwo = styled(BoxStyled)`
  margin-top: 22px;
`
