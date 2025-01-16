import styled from '@emotion/styled'
import { MatchComponentProps } from '@g-loot/react-tournament-brackets/dist/src/types'
import { DefaultOptionType } from 'antd/es/select'
import { FormikTouched, getIn, useFormikContext } from 'formik'
import { ReactElement } from 'react'
import MonroeSelect from '@/components/MonroeSelect.tsx'

import { IBracket, IMatch, IParticipant } from '@/common/interfaces/bracket.ts'
import {
  BottomTeamText,
  EmptyTeamWrapper,
  MatchGameNumberWrapper,
  MatchWrapper,
  TeamsWrapper,
  TopTeamText,
  VsTextWrapper
} from './MatchElements.tsx'
import { Flex } from 'antd'
import { MonroeBlueText } from '@/components/Elements'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import { updateCurrentParticipant, updateMatches, updateMatchParticipants } from './utils.ts'

interface IMatchProps {
  name: string
  matchProps: MatchComponentProps
  brackets: IMatch[]
  teamsOptions: DefaultOptionType[]
  options: DefaultOptionType[]
  handleTouchFiled: (filedName: string) => void
  setNewBracketData: React.Dispatch<
    React.SetStateAction<{
      name: string
      subdivisionsNames: string[]
      playoffTeams: number
      matches: IMatch[]
    }>
  >
  matches?: FormikTouched<IMatch>[]
}

/**
 * The Match component displays an individual match within a tournament bracket.
 * It handles participant updates, seed assignments, and subpool selections.
 *
 * @param {IMatchProps} props - The props for the Match component.
 * @returns {ReactElement} The rendered Match component.
 */
const Match = (props: IMatchProps): ReactElement => {
  const {
    matchProps,
    name,
    options,
    teamsOptions,
    brackets,
    setNewBracketData
  } = props
  const {
    touched,
    setFieldTouched
  } = useFormikContext<ICreateSeasonFormValues>()

  const match = matchProps.match

  const matchParticipants =
    match.participants.length <= 1
      ? [
        ...match.participants,
        {
          id: '2',
          isEmpty: true,
          subpoolName: '',
          seed: null
        }
      ]
      : match.participants

  /**
   * Updates participant data and handles seed conflicts across match participants and brackets.
   *
   * @param {string} value - The new value to set for the participant.
   * @param {string} id - The unique identifier of the participant being updated.
   * @param {'seed' | 'subDivision'} attrName - The property being updated ('seed' or 'subDivision').
   */
  const handleChange = (value: string, id: string, attrName: 'seed' | 'subDivision') => {
    const updatedParticipant = updateCurrentParticipant(
      match.participants as IParticipant[],
      id,
      attrName,
      value
    )

    if (!updatedParticipant) return // nothing was updated

    const updatedParticipants = updateMatchParticipants(match as Partial<IMatch>, id, value, attrName)
    const updatedBrackets = updateMatches(
      brackets,
      match as Partial<IMatch>,
      updatedParticipants,
      updatedParticipant,
      value
    )
    setNewBracketData((prev) => ({ ...prev, matches: updatedBrackets } as IBracket))
  }

  return (
    <MatchWrapper>
      <MatchGameNumberWrapper>{match?.gameNumber}</MatchGameNumberWrapper>

      {match.isNotFirstRound && (
        <TeamsWrapper>
          <TopTeamText isMatched={match.topTeam !== '-'}>{match.topTeam}</TopTeamText>
          <VsTextWrapper>VS</VsTextWrapper>
          <BottomTeamText isMatched={match.bottomTeam !== '-'}>{match.bottomTeam}</BottomTeamText>
        </TeamsWrapper>
      )}

      {!match.isNotFirstRound && (
        <>
          {matchParticipants.map(participant => {
            const fieldName = `${name}[${match.index}].matchParticipants[${participant.index}]`

            const currentTouched = {
              subdivision: getIn(touched, `${fieldName}.subDivision`),
              seed: getIn(touched, `${fieldName}.seed`)
            }
            return (
              <Flex key={participant.id} className="h-42">
                {participant.isEmpty && (
                  <EmptyTeamWrapper>
                    <MonroeBlueText>Bye</MonroeBlueText>
                  </EmptyTeamWrapper>
                )}
                {!participant.isEmpty && (
                  <Flex className="w-full">
                    <MonroeSelect
                      name="subpoolName"
                      className="f-full h-42"
                      placeholder="Choose Subpool"
                      options={options}
                      onChange={(value) => {
                        setFieldTouched(`${fieldName}.subDivision`, true)
                        handleChange(value, `${+participant.id}`, 'subDivision')
                      }}
                      value={participant.subDivision ? `${participant.subDivision}` : ''}
                      is_error={!participant.subDivision && currentTouched.subdivision ? 'true' : 'false'}
                      onBlur={() => setFieldTouched(`${fieldName}.subDivision`, true)}
                    />
                    <MonroeSelectWrapper
                      name="seed"
                      disabled={!participant.subDivision}
                      placeholder="Seed #"
                      value={participant.seed ? `${participant.seed}` : null}
                      options={teamsOptions}
                      onChange={(value) => {
                        setFieldTouched(`${fieldName}.seed`, true)
                        handleChange(value, `${+participant.id}`, 'seed')
                      }}
                      is_error={!participant.seed && currentTouched.seed ? 'true' : 'false'}
                      onBlur={() => setFieldTouched(`${fieldName}.seed`, true)}
                    />
                  </Flex>
                )}
              </Flex>
            )
          })}
        </>
      )}
    </MatchWrapper>
  )
}

export default Match

// Styled Components
const MonroeSelectWrapper = styled(MonroeSelect)`
    height: 42px;
    width: 85px;

    @media (width > 1660px) {
        width: 102px;
    }
`
