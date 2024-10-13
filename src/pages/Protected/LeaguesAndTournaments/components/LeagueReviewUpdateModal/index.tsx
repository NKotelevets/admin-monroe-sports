import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'
import { FC, useState } from 'react'

import {
  ArrowButton,
  Container,
  Content,
  ContentWrapper,
  DefaultButton,
  Title,
} from '@/pages/Protected/LeaguesAndTournaments/components/LeagueReviewUpdateModal/Elements'
import LeagueDetailsColumn from '@/pages/Protected/LeaguesAndTournaments/components/LeagueReviewUpdateModal/components/LeagueDetailsColumn'

import { MonroeDarkBlueText } from '@/components/Elements'
import Message from '@/components/Message'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { compareObjects } from '@/utils/compareObjects'

import {
  BEST_RECORD_WINS,
  LEAGUE,
  POINTS,
  SINGLE_ELIMINATION_BRACKET,
  TOURNAMENT,
  WINNING,
} from '@/common/constants/league'
import { IBECreateLeagueBody, IFELeague, ILeagueDuplicate } from '@/common/interfaces/league'
import { TFullLeagueTournament } from '@/common/types/league'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = "Record can't be updated. Please try again."

type TNormalizedRecord = Omit<IFELeague<TFullLeagueTournament>, 'createdAt' | 'updatedAt'>

const LeagueReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = ({ idx, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const { duplicates, removeDuplicate } = useLeagueSlice()
  const currentDuplicate = duplicates.find((duplicate) => duplicate.index === currentIdx)
  const duplicateData = currentDuplicate!.existing
  const newData = currentDuplicate!.new
  const [updateRecord] = useUpdateLeagueMutation()
  const [isUpdatedSeason, setIsUpdatedSeason] = useState(false)
  const [isError, setIsError] = useState(false)
  const actualIndex = duplicates.indexOf(currentDuplicate as ILeagueDuplicate)

  const normalizedNewRecord: TNormalizedRecord = {
    ...newData,
    type: newData.type === 0 ? LEAGUE : TOURNAMENT,
    playoffFormat: newData.playoff_format === 0 ? BEST_RECORD_WINS : SINGLE_ELIMINATION_BRACKET,
    standingsFormat: newData.standings_format === 0 ? WINNING : POINTS,
    tiebreakersFormat: newData.tiebreakers_format === 0 ? WINNING : POINTS,
    welcomeNote: newData.welcome_note,
    playoffsTeams: newData.playoffs_teams,
    seasons: newData.league_seasons as string[],
    description: newData.description,
  }

  const existingRecordFullData: TNormalizedRecord = {
    ...duplicateData,
    type: duplicateData.type === 0 ? LEAGUE : TOURNAMENT,
    playoffFormat: duplicateData.playoff_format === 0 ? BEST_RECORD_WINS : SINGLE_ELIMINATION_BRACKET,
    standingsFormat: duplicateData.standings_format === 0 ? WINNING : POINTS,
    tiebreakersFormat: duplicateData.tiebreakers_format === 0 ? WINNING : POINTS,
    welcomeNote: duplicateData.welcome_note,
    playoffsTeams: duplicateData.playoffs_teams,
    seasons: duplicateData.league_seasons,
    description: duplicateData.description,
  }

  const objectsDifferences: Record<Partial<keyof IFELeague>, boolean> = compareObjects(
    normalizedNewRecord,
    existingRecordFullData,
  )

  const handleNextDuplicate = () => setCurrentIdx((prev) => prev + 1)

  const handlePrevDuplicate = () => setCurrentIdx((prev) => prev - 1)

  const handleUpdate = () => {
    const backendBodyFormat: IBECreateLeagueBody = {
      description: normalizedNewRecord.description,
      name: normalizedNewRecord.name,
      playoff_format: normalizedNewRecord.playoffFormat === BEST_RECORD_WINS ? 0 : 1,
      playoffs_teams: normalizedNewRecord.playoffsTeams,
      standings_format: normalizedNewRecord.standingsFormat !== POINTS ? 0 : 1,
      tiebreakers_format: normalizedNewRecord.tiebreakersFormat !== POINTS ? 0 : 1,
      type: normalizedNewRecord.type === LEAGUE ? 0 : 1,
      welcome_note: normalizedNewRecord.welcomeNote,
    }

    updateRecord({ id: normalizedNewRecord.id, body: backendBodyFormat })
      .unwrap()
      .then(() => {
        setIsUpdatedSeason(true)
        setIsError(false)
      })
      .catch(() => {
        setIsUpdatedSeason(true)
        setIsError(true)
      })
  }

  const handleSkipForThis = () => {
    if (actualIndex === duplicates.length - 1) {
      onClose()
      return
    }

    handleNextDuplicate()
  }

  const handleNextRecord = () => {
    if (duplicates.length === 1) {
      onClose()
      setIsUpdatedSeason(false)
      removeDuplicate(currentIdx)

      return
    }

    if (actualIndex === duplicates.length - 1) {
      setCurrentIdx(0)
    } else {
      const newIndex = currentIdx + 1

      if (newIndex > duplicates.length - 2) {
        setCurrentIdx(0)
      } else {
        setCurrentIdx((prev) => prev + 1)
      }
    }

    setIsUpdatedSeason(false)
    setTimeout(() => {
      removeDuplicate(currentIdx)
    }, 500)
  }

  const handleClose = () => {
    if (isUpdatedSeason) {
      setIsUpdatedSeason(false)
      removeDuplicate(currentIdx)
    }

    onClose()
  }

  return (
    <Container>
      <ContentWrapper>
        <Content>
          <Title>Review update</Title>

          <Flex>
            <LeagueDetailsColumn
              {...existingRecordFullData}
              title="Current"
              isNew={false}
              difference={objectsDifferences}
            />

            <LeagueDetailsColumn title="Imported" {...normalizedNewRecord} isNew difference={objectsDifferences} />
          </Flex>

          {isUpdatedSeason && (
            <Message type={isError ? 'error' : 'success'} text={!isError ? SUCCESS_MESSAGE : ERROR_MESSAGE} />
          )}
        </Content>

        <Flex className="p16" align="center" justify="space-between">
          <Flex align="center">
            <ArrowButton disabled={actualIndex === 0} onClick={handlePrevDuplicate}>
              <LeftOutlined />
            </ArrowButton>
            <ArrowButton disabled={actualIndex + 1 === duplicates.length} onClick={handleNextDuplicate}>
              <RightOutlined />
            </ArrowButton>

            <MonroeDarkBlueText>
              {actualIndex + 1} of {duplicates.length} duplicate
            </MonroeDarkBlueText>
          </Flex>

          <Flex>
            <DefaultButton type="default" onClick={handleClose}>
              Close
            </DefaultButton>

            {duplicates.length > 1 && (
              <DefaultButton type="default" onClick={handleSkipForThis}>
                Skip for this
              </DefaultButton>
            )}

            {isUpdatedSeason ? (
              <>
                {duplicates.length > 1 && (
                  <Button type="primary" className="br-4" onClick={handleNextRecord}>
                    Next record
                  </Button>
                )}
              </>
            ) : (
              <Button type="primary" className="br-4" onClick={handleUpdate}>
                Update current
              </Button>
            )}
          </Flex>
        </Flex>
      </ContentWrapper>
    </Container>
  )
}

export default LeagueReviewUpdateModal
