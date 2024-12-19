import styled from '@emotion/styled'
import { MatchComponentProps } from '@g-loot/react-tournament-brackets/dist/src/types'
import { DefaultOptionType } from 'antd/es/select'
import { FormikTouched, getIn, useFormikContext } from 'formik'
import { FC } from 'react'
import MonroeSelect from '@/components/MonroeSelect'

import { IBracket, IMatch } from '@/common/interfaces/bracket'
import {
  BottomTeamText,
  EmptyTeamWrapper,
  MatchGameNumberWrapper,
  MatchWrapper,
  TeamsWrapper,
  TopTeamText,
  VsTextWrapper
} from './MatchElements'
import { Flex } from 'antd'
import { MonroeBlueText } from '@/components/Elements'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'

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

const MonroeSelectWrapper = styled(MonroeSelect)`
    height: 42px;
    width: 85px;

    @media (width > 1660px) {
        width: 102px;
    }
`

const Match: FC<IMatchProps> = (props) => {
  const {
    matchProps ,
    name,
    options,
    teamsOptions,
    brackets,
    setNewBracketData
  } = props
  const {
    touched,
    setFieldTouched,
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

  const handleChange = (value: string, id: string, name: 'seed' | 'subDivision') => {
    const currentParticipant = match.participants.find((p) => p.id === id)
    if (!currentParticipant) return

    const updatedParticipant = { ...currentParticipant, [name]: value }
    const updatedParticipants = match.participants.map((p) => {
      if (p.id === id) return updatedParticipant

      if (name === 'seed' && p.seed === +value && p.id !== id)
        return {
          ...p,
          seed: null,
        }

      return p
    })

    const updatedBrackets = brackets.map((b) => {
      if (b.id === match.id) {
        return {
          ...match,
          matchParticipants: updatedParticipants,
        }
      }

      const updatedBracket = {
        ...b,
        matchParticipants: b.matchParticipants.map((p) => {
          if (p.seed === +value) {
            return {
              ...p,
              seed: null,
            }
          }

          return p
        }),
      }

      return updatedBracket
    })

    setNewBracketData((prev) => ({ ...prev, matches: updatedBrackets  } as IBracket))
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
                      is_error={!participant.subDivision  && currentTouched.subdivision ? 'true' : 'false'}
                      onBlur={() => setFieldTouched(`${fieldName}.subDivision`, true)}
                    />
                    <MonroeSelectWrapper
                      name="seed"
                      placeholder="Seed #"
                      value={participant.seed ? `${participant.seed}` : null}
                      options={teamsOptions}
                      onChange={(value) => {
                        setFieldTouched(`${fieldName}.seed`, true)
                        handleChange(value, `${+participant.id}`, 'seed')
                      }}
                      is_error={!participant.seed  && currentTouched.seed ? 'true' : 'false'}
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
