import { containerStyles, contentStyles, contentWrapperStyles, defaultButtonStyles, titleStyles } from './styles'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { format } from 'date-fns'
import { FC, useState } from 'react'

import SeasonDetailsColumn from '@/pages/Protected/Seasons/components/SeasonsReviewUpdateModal/components/SeasonDetailsColumn'

import Loader from '@/components/Loader'
import Message from '@/components/Message'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useGetSeasonBEDetailsQuery, useUpdateSeasonMutation } from '@/redux/seasons/seasons.api'

import { compareObjects } from '@/utils/compareObjects'

import { IImportedSubdivision, IUpdateDivision } from '@/common/interfaces/division'
import { IBESeason, ISeasonDuplicate, ISeasonReviewUpdateData } from '@/common/interfaces/season'

const SUCCESS_MESSAGE = 'Record Updated'
const ERROR_MESSAGE = "Record can't be updated. Please try again."

const SeasonsReviewUpdateModal: FC<{ idx: number; onClose: () => void }> = ({ idx, onClose }) => {
  const { duplicates, removeDuplicate } = useSeasonSlice()
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const currentDuplicate = duplicates.find((duplicate) => duplicate.index === currentIdx)
  const actualIndex = duplicates.indexOf(currentDuplicate as ISeasonDuplicate)
  const newData = currentDuplicate?.new
  const [updateSeason] = useUpdateSeasonMutation()
  const { data } = useGetSeasonBEDetailsQuery(currentDuplicate?.existing.id as string, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  })
  const [isUpdatedSeason, setIsUpdatedSeason] = useState(false)
  const [isError, setIsError] = useState(false)

  if (!data || !newData) return <Loader />

  const duplicateData = data as IBESeason
  const normalizedNewData: ISeasonReviewUpdateData = {
    expectedEndDate: format(newData.expectedEndDate, 'dd MMM yyyy'),
    linkedLeagueName: newData.linkedLeagueTournament,
    name: newData.name,
    startDate: format(newData.startDate, 'dd MMM yyyy'),
    divisions: [
      {
        name: newData.divisionPollName,
        description: newData.divisionPollDescription,
        sub_division: [
          {
            name: newData.subdivisionPollName,
            playoff_format: newData.playoffFormat,
            standings_format: newData.standingsFormat,
            tiebreakers_format: newData.tiebreakersFormat,
            description: newData.subdivisionPollDescription,
            brackets: [],
            changed: false,
          },
        ],
      },
    ],
  }
  const normalizedExistingData: ISeasonReviewUpdateData = {
    expectedEndDate: format(newData.expectedEndDate, 'dd MMM yyyy'),
    linkedLeagueName: duplicateData.league.name,
    name: duplicateData.name,
    startDate: format(duplicateData.start_date, 'dd MMM yyyy'),
    divisions: duplicateData.divisions.map((division) => ({
      name: division.name,
      description: division.description,
      sub_division: division.sub_division.map((subdivision) => ({
        name: subdivision.name,
        description: subdivision.description,
        playoff_format: subdivision.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
        standings_format: subdivision.standings_format === 0 ? 'Winning %' : 'Points',
        tiebreakers_format: subdivision.tiebreakers_format === 0 ? 'Winning %' : 'Points',
        changed: subdivision.changed,
        brackets: subdivision.brackets,
      })),
    })),
  }
  const objectsDifferences: Record<Partial<keyof ISeasonReviewUpdateData>, boolean> = compareObjects(
    normalizedNewData,
    normalizedExistingData,
  )
  const currentDivision = normalizedExistingData.divisions.find(
    (division) => division.name === normalizedNewData.divisions[0].name,
  )
  const newSubdivision = normalizedNewData.divisions[0].sub_division[0]
  const existedSubdivision = currentDivision?.sub_division.find(
    (subdivision) => subdivision.name === normalizedNewData.divisions[0].sub_division[0].name,
  )
  const isDifference = existedSubdivision
    ? !(
        newSubdivision.playoff_format === existedSubdivision.playoff_format &&
        newSubdivision.standings_format === existedSubdivision.standings_format &&
        newSubdivision.tiebreakers_format === existedSubdivision.tiebreakers_format &&
        newSubdivision.description === existedSubdivision.description
      )
    : true
  const isDivisionOrSubdivisionChanged = currentDivision ? !!isDifference : true

  const handleNextDuplicate = () => setCurrentIdx((prev) => prev + 1)

  const handlePrevDuplicate = () => setCurrentIdx((prev) => prev - 1)

  const handleSkipForThis = () => {
    if (actualIndex === duplicates.length - 1) {
      onClose()
      return
    }

    handleNextDuplicate()
  }

  const handleUpdate = () => {
    const mappedDivisions: IUpdateDivision[] = duplicateData.divisions.map((division) => ({
      id: division.id as string,
      name: division.name,
      description: division.description,
      sub_division: division.sub_division.map((subdivision) => ({
        id: subdivision.id as string,
        name: subdivision.name,
        description: subdivision.description,
        playoff_format: subdivision.playoff_format,
        standings_format: subdivision.standings_format,
        tiebreakers_format: subdivision.tiebreakers_format,
        brackets: subdivision.brackets,
        changed: subdivision.changed,
      })),
    }))

    const mappedNewDivisions: IUpdateDivision[] = normalizedNewData.divisions.map((division) => ({
      name: division.name,
      description: division.description,
      sub_division: division.sub_division.map((subdivision) => ({
        name: subdivision.name,
        description: subdivision.description,
        playoff_format: subdivision.playoff_format === 'Best Record Wins' ? 0 : 1,
        standings_format: subdivision.standings_format === 'Winning %' ? 0 : 1,
        tiebreakers_format: subdivision.tiebreakers_format === 'Winning %' ? 0 : 1,
        brackets: [],
        changed: false,
      })),
    }))

    const currentDivision = mappedDivisions.find((division) => division.name === mappedNewDivisions[0].name)

    let updatingMappedDivisions: IUpdateDivision[] = []

    if (currentDivision) {
      const updatedDivision = existedSubdivision
        ? {
            ...currentDivision,
            sub_division: currentDivision?.sub_division.map((subdivision) => {
              if (subdivision.name === mappedNewDivisions[0].sub_division[0].name) {
                return {
                  id: subdivision.id,
                  ...mappedNewDivisions[0].sub_division[0],
                }
              }
              return subdivision
            }),
          }
        : ({
            ...currentDivision,
            sub_division: [
              ...(currentDivision?.sub_division as IImportedSubdivision[]),
              mappedNewDivisions[0].sub_division[0],
            ],
          } as IUpdateDivision)

      updatingMappedDivisions = mappedDivisions.map((division) => {
        if (division.name === updatedDivision.name) return updatedDivision as IUpdateDivision
        return division
      })
    } else {
      updatingMappedDivisions = [
        ...mappedDivisions,
        {
          ...normalizedNewData.divisions[0],
          sub_division: normalizedNewData.divisions[0].sub_division.map((subdivision) => ({
            name: subdivision.name,
            description: subdivision.description,
            playoff_format: subdivision.playoff_format === 'Best Record Wins' ? 0 : 1,
            standings_format: subdivision.standings_format === 'Points' ? 1 : 0,
            tiebreakers_format: subdivision.tiebreakers_format === 'Points' ? 1 : 0,
            brackets: [],
            changed: false,
          })),
        },
      ]
    }

    const divisions = isDivisionOrSubdivisionChanged ? updatingMappedDivisions : mappedDivisions

    updateSeason({
      id: duplicateData.id,
      body: {
        name: normalizedExistingData.name,
        start_date: format(newData.startDate, 'yyyy-MM-dd'),
        expected_end_date: format(newData.expectedEndDate, 'yyyy-MM-dd'),
        league_id: duplicateData.league.id,
        divisions,
      },
    })
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

          <Flex style={{ width: '790px' }}>
            <SeasonDetailsColumn
              {...normalizedExistingData}
              title="Current"
              isNew={false}
              differences={objectsDifferences}
              isDivisionOrSubdivisionChanged={isDivisionOrSubdivisionChanged}
            />

            <SeasonDetailsColumn
              {...normalizedNewData}
              isDivisionOrSubdivisionChanged={isDivisionOrSubdivisionChanged}
              title="Imported"
              isNew
              differences={objectsDifferences}
            />
          </Flex>

          {isUpdatedSeason && (
            <Message type={isError ? 'error' : 'success'} text={!isError ? SUCCESS_MESSAGE : ERROR_MESSAGE} />
          )}
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: '16px',
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Flex align="center">
            <Button
              disabled={actualIndex === 0 || isUpdatedSeason}
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
              disabled={actualIndex + 1 === duplicates.length || isUpdatedSeason}
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

            {duplicates.length > 1 && !isUpdatedSeason && (
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

export default SeasonsReviewUpdateModal
