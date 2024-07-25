import {
  containerStyles,
  contentStyles,
  contentWrapperStyles,
  defaultButtonStyles,
  titleStyles,
} from './styles'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { FC, useState } from 'react'

import SeasonDetailsColumn from '@/pages/Protected/Seasons/components/SeasonsReviewUpdateModal/components/SeasonDetailsColumn'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { compareObjects } from '@/utils/compareObjects'

import { ISeasonReviewUpdateData } from '@/common/interfaces/season'
import { format } from 'date-fns'

const SeasonsReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = ({
  idx,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const { duplicates } = useSeasonSlice()
  const currentDuplicate = duplicates.find(
    (duplicate) => duplicate.index === currentIdx
  )
  const duplicateData = currentDuplicate!.existing
  const newData = currentDuplicate!.new
  const normalizedNewData: ISeasonReviewUpdateData = {
    expectedEndDate: format(newData.expectedEndDate, 'dd MMM yyyy'),
    linkedLeagueName: newData.linkedLeagueTournament,
    name: newData.name,
    playoffFormat: newData.playoffFormat,
    standingsFormat: newData.standingsFormat,
    startDate: format(newData.startDate, 'dd MMM yyyy'),
    tiebreakersFormat: newData.tiebreakersFormat,
  }
  const normalizedExistingData: ISeasonReviewUpdateData = {
    expectedEndDate: format(duplicateData.expected_end_date, 'dd MMM yyyy'),
    linkedLeagueName: duplicateData.league.name,
    name: duplicateData.name,
    playoffFormat: 'Currently not available',
    startDate: format(duplicateData.start_date, 'dd MMM yyyy'),
    standingsFormat: 'Currently not available',
    tiebreakersFormat: 'Currently not available',
  }

  const objectsDifferences: Record<
    Partial<keyof ISeasonReviewUpdateData>,
    boolean
  > = compareObjects(normalizedNewData, normalizedExistingData)

  const handleNextDuplicate = () => setCurrentIdx((prev) => prev + 1)

  const handlePrevDuplicate = () => setCurrentIdx((prev) => prev - 1)

  const handleUpdate = () => {
    // TODO: add functionality when BE will be ready
  }

  const handleSkipForThis = () => {
    if (currentIdx + 1 === duplicates.length) {
      onClose()
      return
    }

    setCurrentIdx((prev) => prev + 1)
  }

  return (
    <Flex style={containerStyles} align="center" justify="center">
      <Flex style={contentWrapperStyles} vertical>
        <Flex vertical style={contentStyles}>
          <Typography.Title level={3} style={titleStyles}>
            Review update
          </Typography.Title>

          <Flex>
            <SeasonDetailsColumn
              {...normalizedExistingData}
              title="Current"
              isNew={false}
              differences={objectsDifferences}
            />

            <SeasonDetailsColumn
              {...normalizedNewData}
              title="Imported"
              isNew
              differences={objectsDifferences}
            />
          </Flex>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          style={{ padding: '16px' }}
        >
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
            <Button
              type="default"
              style={defaultButtonStyles}
              onClick={onClose}
            >
              Close
            </Button>

            {duplicates.length > 1 && (
              <Button
                type="default"
                style={defaultButtonStyles}
                onClick={handleSkipForThis}
              >
                Skip for this
              </Button>
            )}

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

export default SeasonsReviewUpdateModal
