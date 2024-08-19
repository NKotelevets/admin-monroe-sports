import styled from '@emotion/styled'
import { MatchComponentProps } from '@g-loot/react-tournament-brackets/dist/src/types'
import { Flex } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FC } from 'react'

import {
  BottomTeamText,
  EmptyTeamWrapper,
  MatchGameNumberWrapper,
  MatchWrapper,
  TeamsWrapper,
  TopTeamText,
  VsTextWrapper,
} from '@/pages/Protected/Seasons/CreateBracket/components/MatchElements'

import { MonroeBlueText } from '@/components/Elements'
import MonroeSelect from '@/components/MonroeSelect'

import { IMatch } from '@/common/interfaces/bracket'

interface IMatchProps {
  matchProps: MatchComponentProps
  brackets: IMatch[]
  teamsOptions: DefaultOptionType[]
  options: DefaultOptionType[]
  setNewBracketData: React.Dispatch<
    React.SetStateAction<{
      name: string
      subdivisionsNames: string[]
      playoffTeams: number
      matches: IMatch[]
    }>
  >
}

const MonroeSelectWrapper = styled(MonroeSelect)`
  height: 42px;
  width: 85px;

  @media (width > 1660px) {
    width: 102px;
  }
`

const Match: FC<IMatchProps> = ({ brackets, matchProps, teamsOptions, options, setNewBracketData }) => {
  const match = matchProps.match as IMatch
  const matchParticipants =
    match.participants.length === 1
      ? [
          ...match.participants,
          {
            id: '2',
            isEmpty: true,
            subpoolName: '',
            seed: null,
          },
        ]
      : match.participants

  const handleChange = (value: string, id: string, name: 'seed' | 'subpoolName') => {
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
          participants: updatedParticipants,
        }
      }

      const updatedBracket = {
        ...b,
        participants: b.participants.map((p) => {
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

    setNewBracketData((prev) => ({ ...prev, matches: updatedBrackets }))
  }

  return (
    <MatchWrapper>
      <MatchGameNumberWrapper>{match?.gameNumber}</MatchGameNumberWrapper>
      <>
        {match.isNotFirstRound ? (
          <TeamsWrapper>
            <TopTeamText isMatched={match.topTeam !== '-'}>{match.topTeam}</TopTeamText>

            <VsTextWrapper>VS</VsTextWrapper>

            <BottomTeamText isMatched={match.bottomTeam !== '-'}>{match.bottomTeam}</BottomTeamText>
          </TeamsWrapper>
        ) : (
          <>
            {matchParticipants.map((participant) => (
              <Flex
                key={participant.id}
                style={{
                  height: '42px',
                }}
              >
                {participant.isEmpty ? (
                  <EmptyTeamWrapper>
                    <MonroeBlueText>Bye</MonroeBlueText>
                  </EmptyTeamWrapper>
                ) : (
                  <Flex
                    style={{
                      width: '100%',
                    }}
                  >
                    <MonroeSelect
                      styles={{ flex: '1 1 auto', height: '42px' }}
                      placeholder="Choose Subpool"
                      options={options}
                      onChange={(value) => handleChange(value, `${participant.id}`, 'subpoolName')}
                      value={
                        participant.subpoolName?.length
                          ? participant.subpoolName?.length > 16
                            ? participant.subpoolName?.substring(0, 16) + '...'
                            : participant?.subpoolName
                          : undefined
                      }
                      name="subpoolname"
                    />

                    <MonroeSelectWrapper
                      name="playoffsTeams"
                      value={participant.seed ? `${participant.seed}` : null}
                      options={teamsOptions}
                      onChange={(value) => handleChange(value, `${participant.id}`, 'seed')}
                      placeholder="Seed #"
                    />
                  </Flex>
                )}
              </Flex>
            ))}
          </>
        )}
      </>
    </MatchWrapper>
  )
}

export default Match
