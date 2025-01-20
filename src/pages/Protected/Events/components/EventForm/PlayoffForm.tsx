import { useFormikContext } from 'formik'
import { IEventForm } from '@/common/interfaces/event.ts'
import { useEffect, useState } from 'react'
import { VS } from '@/pages/Protected/Events/components/VS.tsx'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'

import { FormSummary } from '@/components/FormSummary.tsx'
import { Box } from '@/components/Elements'
import styled from '@emotion/styled'
import { IFEMatch } from '@/common/interfaces/division.ts'


export const PlayoffForm = () => {
  const { values } = useFormikContext<IEventForm>()
  const { divisionsAvailable } = useEventFormContext()

  const [currentGame, setCurrentGame] = useState<IFEMatch | null>(null)

  useEffect(() => {
    if (!values.game) return

    const find = divisionsAvailable?.flatMap(division => division.brackets)
      ?.flatMap(bracket => bracket.matches)
      ?.find(match => match.id === values.game)

    if (!find) return

    setCurrentGame(find)
  }, [divisionsAvailable, values.game])

  const team1Name = currentGame?.topTeam || 'Team 1'
  const team2Name = currentGame?.bottomTeam || 'Team 2'

  // FIXME: will this data be present on match object that is missing?
  const team1CoachName = 'Missing data from BE'
  const team2CoachName = 'Missing data from BE'

  return (
    <>
      <BoxStyled
        showForm={true}
        direction="vertical"
        error={false}
      >
        <FormSummary
          error={false}
          title={team1Name}
          subtitle={team1CoachName}
        />
      </BoxStyled>
      <VS />
      <TeamTwo
        showForm={true}
        direction="vertical"
        error={false}
      >
        <FormSummary
          error={false}
          title={team2Name}
          subtitle={team2CoachName}
        />
      </TeamTwo>
    </>
  )
}

// Styled Components
const BoxStyled = styled(Box)`
    margin-bottom: 24px;
    cursor: unset;
`
const TeamTwo = styled(BoxStyled)`
    margin-top: 22px;
`
