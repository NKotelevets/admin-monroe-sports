import { Table } from 'antd'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import {
  useMasterTeamImportInfoTableParams
} from '@/pages/Protected/MasterTeams/hooks/useMasterTeamImportInfoTableParams.tsx'
import { createPortal } from 'react-dom'
import { DuplicateReviewModal } from '@/components/DuplicateReviewModal'
import {
  IDuplicateExtraData,
  IFEExistingMasterTeamDuplicate,
  IFENewMasterTeamDuplicate
} from '@/common/interfaces/masterTeams.ts'
import { useEditMasterTeamMutation } from '@/redux/masterTeams/masterTeams.api.ts'
import { MasterTeamDuplicateReview } from './MasterTeamDuplicateReview'

/**
 * Master Team Import Table
 *
 * Component renders a table for managing duplicate imported Master Teams.
 * Displays the name and status (duplicate or error) of each record, and provides
 * controls for reviewing and updating duplicate entries using a modal.
 *
 * @returns {ReactElement} The rendered table component with modal handling for duplicates.
 */
export const MasterTeamImportTable = (): ReactElement => {
  const [editMasterTeam, { isLoading: isUpdating, isSuccess, reset, isError }] = useEditMasterTeamMutation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const resetRef = useRef(reset)

  const {
    importCSVTableRecords: records,
    duplicates,
    removeDuplicate
  } = useMasterTeamsSlice()

  const {
    columns,
    tableParams,
    handleTableChange
  } = useMasterTeamImportInfoTableParams({
    setSelectedIndex,
    records: duplicates
  })

  useEffect(() => {
    resetRef.current = reset
  },[reset])

  const onClose = () => {
    resetRef.current()
    setSelectedIndex(null)
  }

  // remove current duplicate and goes to next
  const onSkip = (index: number) => {
    resetRef.current()
    removeDuplicate(index)
  }

  // handles update mt
  const onUpdate = useCallback((index: number) => {
    const currentMT = duplicates[index].existing

    const currentHC = currentMT.headCoachData
    const newHC = duplicates[index].new.headCoachData || {} as IDuplicateExtraData
    const currentTA = currentMT.adminData?.map(ta => ta.id) || []
    const newTA = duplicates[index].new.adminData?.map(nta => nta.id) || []

    const headCoach = Object.keys(newHC).length === 0 ? currentHC.id : newHC.id
    const teamAdminList = [...new Set([...currentTA, ...newTA])]

    editMasterTeam({
      id: duplicates[index].existing.id,
      body: {
        name: currentMT.name,
        head_coach: headCoach,
        team_admins: teamAdminList
      }
    })
  }, [duplicates])

  return (
    <>
      {selectedIndex !== null && (
        createPortal((
          <DuplicateReviewModal<IFENewMasterTeamDuplicate, IFEExistingMasterTeamDuplicate>
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
              <MasterTeamDuplicateReview index={index} duplicates={duplicates} />
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
