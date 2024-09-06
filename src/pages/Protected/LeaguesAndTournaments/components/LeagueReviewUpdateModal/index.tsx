import LeagueTournDetailsColumn from './components/LeagueDetailsColumn'
import { containerStyles, contentStyles, contentWrapperStyles, defaultButtonStyles, titleStyles } from './styles'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { FC, useState } from 'react'

import Message from '@/components/Message'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { compareObjects } from '@/utils/compareObjects'

import { IBECreateLeagueBody, IFELeague, ILeagueDuplicate } from '@/common/interfaces/league'
import { TFullLeagueTournament } from '@/common/types/league'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = "Record can't be updated. Please try again."

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

  const normalizedNewRecord: Omit<IFELeague<TFullLeagueTournament>, 'createdAt' | 'updatedAt'> = {
    ...newData,
    type: newData.type === 0 ? 'League' : 'Tournament',
    playoffFormat: newData.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
    standingsFormat: newData.standings_format === 0 ? 'Winning %' : 'Points',
    tiebreakersFormat: newData.tiebreakers_format === 0 ? 'Winning %' : 'Points',
    welcomeNote: newData.welcome_note,
    playoffsTeams: newData.playoffs_teams,
    seasons: newData.league_seasons as string[],
    description: newData.description,
  }

  const existingRecordFullData: Omit<IFELeague<TFullLeagueTournament>, 'createdAt' | 'updatedAt'> = {
    ...duplicateData,
    type: duplicateData.type === 0 ? 'League' : 'Tournament',
    playoffFormat: duplicateData.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
    standingsFormat: duplicateData.standings_format === 0 ? 'Winning %' : 'Points',
    tiebreakersFormat: duplicateData.tiebreakers_format === 0 ? 'Winning %' : 'Points',
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
      playoff_format: normalizedNewRecord.playoffFormat === 'Best Record Wins' ? 0 : 1,
      playoffs_teams: normalizedNewRecord.playoffsTeams,
      standings_format: normalizedNewRecord.standingsFormat !== 'Points' ? 0 : 1,
      tiebreakers_format: normalizedNewRecord.tiebreakersFormat !== 'Points' ? 0 : 1,
      type: normalizedNewRecord.type === 'League' ? 0 : 1,
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
    <Flex style={containerStyles} align="center" justify="center">
      <Flex style={contentWrapperStyles} vertical>
        <Flex vertical style={contentStyles}>
          <Typography.Title level={3} style={titleStyles}>
            Review update
          </Typography.Title>

          <Flex>
            <LeagueTournDetailsColumn
              {...existingRecordFullData}
              title="Current"
              isNew={false}
              difference={objectsDifferences}
            />

            <LeagueTournDetailsColumn title="Imported" {...normalizedNewRecord} isNew difference={objectsDifferences} />
          </Flex>

          {isUpdatedSeason && (
            <Message type={isError ? 'error' : 'success'} text={!isError ? SUCCESS_MESSAGE : ERROR_MESSAGE} />
          )}
        </Flex>

        <Flex align="center" justify="space-between" style={{ padding: '16px' }}>
          <Flex align="center">
            <Button
              disabled={actualIndex === 0}
              style={{
                background: 'transparent',
                border: 0,
                padding: 6,
              }}
              onClick={handlePrevDuplicate}
            >
              <LeftOutlined />
            </Button>
            <Button
              disabled={actualIndex + 1 === duplicates.length}
              style={{
                background: 'transparent',
                border: 0,
                padding: 6,
              }}
              onClick={handleNextDuplicate}
            >
              <RightOutlined />
            </Button>

            <Typography.Text style={{ color: 'rgba(26, 22, 87, 1)' }}>
              {actualIndex + 1} of {duplicates.length} duplicate
            </Typography.Text>
          </Flex>

          <Flex>
            <Button type="default" style={defaultButtonStyles} onClick={handleClose}>
              Close
            </Button>

            {duplicates.length > 1 && (
              <Button type="default" style={defaultButtonStyles} onClick={handleSkipForThis}>
                Skip for this
              </Button>
            )}

            {isUpdatedSeason ? (
              <>
                {duplicates.length > 1 && (
                  <Button
                    type="primary"
                    style={{
                      borderRadius: '4px',
                    }}
                    onClick={handleNextRecord}
                  >
                    Next record
                  </Button>
                )}
              </>
            ) : (
              <Button
                type="primary"
                style={{
                  borderRadius: '4px',
                }}
                onClick={handleUpdate}
              >
                Update current
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LeagueReviewUpdateModal
