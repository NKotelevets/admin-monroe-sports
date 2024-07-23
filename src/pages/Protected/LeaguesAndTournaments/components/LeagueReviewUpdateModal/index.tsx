import LeagueTournDetailsColumn from './components/LeagueDetailsColumn'
import { containerStyles, contentStyles, contentWrapperStyles, defaultButtonStyles, titleStyles } from './styles'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { FC, useState } from 'react'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useBulkUpdateLeaguesMutation, useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { compareObjects } from '@/utils/compareObjects'

import { IBECreateLeagueBody, IBEUpdateLeagueBody, IFELeague } from '@/common/interfaces/league'
import { TFullLeagueTournament } from '@/common/types/league'

const LeagueReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = ({ idx, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const { duplicates, removeDuplicate } = useLeagueSlice()
  const currentDuplicate = duplicates.find((duplicate) => duplicate.index === currentIdx)
  const duplicateData = currentDuplicate!.existing
  const newData = currentDuplicate!.new
  const [updateRecord] = useUpdateLeagueMutation()
  const { setAppNotification } = useAppSlice()
  const [bulkUpdate] = useBulkUpdateLeaguesMutation()

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
        setAppNotification({
          message: 'Successfully update',
          type: 'success',
          timestamp: new Date().getTime(),
        })
        onClose()
        removeDuplicate(idx)
      })
      .catch(() => onClose())
  }

  const handleUpdateAll = () => {
    const records: IBEUpdateLeagueBody[] = duplicates.map((duplicate) => duplicate.new)

    bulkUpdate(records)
      .unwrap()
      .then(() => {
        onClose()
        duplicates.map((duplicate) => removeDuplicate(duplicate.index))
      })
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
              title="current"
              isNew={false}
              difference={objectsDifferences}
            />

            <LeagueTournDetailsColumn title="new" {...normalizedNewRecord} isNew difference={objectsDifferences} />
          </Flex>
        </Flex>

        <Flex align="center" justify="space-between" style={{ padding: '16px' }}>
          <Flex align="center">
            <Button
              disabled={currentIdx === 0}
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
              disabled={currentIdx + 1 === duplicates.length}
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
              {currentIdx + 1} of {duplicates.length} duplicate
            </Typography.Text>
          </Flex>

          <Flex>
            <Button type="default" style={defaultButtonStyles} onClick={onClose}>
              Close
            </Button>

            <Button type="default" style={defaultButtonStyles} onClick={handleUpdateAll}>
              Update All
            </Button>

            <Button disabled={currentIdx + 1 === duplicates.length} type="default" style={defaultButtonStyles}>
              Skip for this
            </Button>

            <Button
              type="primary"
              style={{
                borderRadius: '4px',
              }}
              onClick={handleUpdate}
            >
              Update current
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LeagueReviewUpdateModal

