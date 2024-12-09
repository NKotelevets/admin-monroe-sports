import { Table } from 'antd'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { createPortal } from 'react-dom'
import { DuplicateReviewModal } from '@/components/DuplicateReviewModal'
import { useEditLeagueTeamMutation } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { LeagueTeamDuplicateReview } from './LeagueTeamDuplicateReview'
import {
  useLeagueTeamImportInfoTableParams
} from '@/pages/Protected/LeagueTeams/hooks/useLeagueTeamImportInfoTableParams.tsx'
import { ILeagueTeamImportExisting, ILeagueTeamImportNew } from '@/common/interfaces/leagueTeams.ts'

/**
 * Master Team Import Table
 *
 * Component renders a table for managing duplicate imported Master Teams.
 * Displays the name and status (duplicate or error) of each record, and provides
 * controls for reviewing and updating duplicate entries using a modal.
 *
 * @returns {ReactElement} The rendered table component with modal handling for duplicates.
 */
export const LeagueTeamImportTable = (): ReactElement => {
  const [editLeagueTeam, { isLoading: isUpdating, isSuccess, reset, isError }] = useEditLeagueTeamMutation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const resetRef = useRef(reset)

  const {
    importCSVTableRecords: records,
    duplicates,
    removeDuplicate
  } = useLeagueTeamsSlice()

  const {
    columns,
    tableParams,
    handleTableChange
  } = useLeagueTeamImportInfoTableParams({
    setSelectedIndex,
    records: duplicates
  })

  useEffect(() => {
    resetRef.current = reset
  }, [reset])

  const onClose = () => {
    resetRef.current()
    setSelectedIndex(null)
  }

  // remove current duplicate and goes to next
  const onSkip = (index: number) => {
    resetRef.current()
    removeDuplicate(index)
  }

  // handles update league
  const onUpdate = useCallback((index: number) => {
    const currentLeagueTeam = duplicates[index].existing

    editLeagueTeam({
      id: currentLeagueTeam.id,
      body: {
        name: currentLeagueTeam.leagueTeamName, // TODO: add other values here
      }
    })
  }, [duplicates])

  return (
    <>
      {selectedIndex !== null && (
        createPortal((
          <DuplicateReviewModal<ILeagueTeamImportNew, ILeagueTeamImportExisting>
            duplicates={duplicates}
            isLoading={isUpdating}
            error={isError}
            success={isSuccess}
            idx={selectedIndex}
            onClose={onClose}
            handleUpdate={onUpdate}
            removeDuplicateByIndex={onSkip}
            onChange={reset}
          >
            {(index: number) => (
              <LeagueTeamDuplicateReview index={index} duplicates={duplicates} />
            )}
          </DuplicateReviewModal>
        ), document.getElementById('page-portal')!)
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.idx}
        dataSource={records}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </>
  )
}
