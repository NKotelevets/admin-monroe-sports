import styled from '@emotion/styled'
import { MatchComponentProps } from '@g-loot/react-tournament-brackets/dist/src/types'
import { Flex } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { FormikTouched } from 'formik'
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

import { IMatch, IParticipant } from '@/common/interfaces/bracket'

interface IMatchProps {
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

const Match: FC<IMatchProps> = ({
  brackets,
  matchProps,
  teamsOptions,
  options,
  setNewBracketData,
  handleTouchFiled,
  matches,
}) => {
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
            {matchParticipants.map((participant) => {
              const participantValue = participant.subpoolName?.length
                ? participant.subpoolName?.length > 16
                  ? participant.subpoolName?.substring(0, 16) + '...'
                  : participant?.subpoolName
                : undefined

              const participantTouch = matches?.[match.id - 1]?.participants?.[
                +participant.id - 1
              ] as FormikTouched<IParticipant>

              return (
                <Flex key={participant.id} className="h-42">
                  {participant.isEmpty ? (
                    <EmptyTeamWrapper>
                      <MonroeBlueText>Bye</MonroeBlueText>
                    </EmptyTeamWrapper>
                  ) : (
                    <Flex className="w-full">
                      <MonroeSelect
                        className="f-full h-42"
                        placeholder="Choose Subpool"
                        options={options}
                        onChange={(value) => {
                          handleTouchFiled(`${match.id - 1}.participants.${+participant.id - 1}.subpoolName`)
                          handleChange(value, `${+participant.id}`, 'subpoolName')
                        }}
                        value={participantValue}
                        name="subpoolName"
                        is_error={`${participantTouch?.subpoolName ? !participantValue : 'false'}`}
                        onBlur={() =>
                          handleTouchFiled(`${match.id - 1}.participants.${+participant.id - 1}.subpoolName`)
                        }
                      />

                      <MonroeSelectWrapper
                        name="seed"
                        value={participant.seed ? `${participant.seed}` : null}
                        options={teamsOptions}
                        onChange={(value) => {
                          handleTouchFiled(`${match.id - 1}.participants.${+participant.id - 1}.seed`)
                          handleChange(value, `${+participant.id}`, 'seed')
                        }}
                        placeholder="Seed #"
                        is_error={`${participantTouch?.seed ? !participant.seed : 'false'}`}
                        onBlur={() => handleTouchFiled(`${match.id - 1}.participants.${+participant.id - 1}.seed`)}
                      />
                    </Flex>
                  )}
                </Flex>
              )
            })}
          </>
        )}
      </>
    </MatchWrapper>
  )
}

export default Match
