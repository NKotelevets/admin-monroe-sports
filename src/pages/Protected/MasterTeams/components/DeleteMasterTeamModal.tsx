import MonroeModal from '@/components/MonroeModal.tsx'
import { PATH_TO_DELETING_INFO_MASTER_TEAMS } from '@/common/constants/paths.ts'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import Loader from '@/components/Loader.tsx'
import { useNotification } from '@/hooks/useNotification.ts'
import { useBulkDeleteMasterTeamsMutation } from '@/redux/masterTeams/masterTeams.api.ts'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'

interface TDeleteModal {
  selectedRecordsIds: string[]
  isDeleteAllRecords: boolean
  onDelete?(): void
}

export type DeleteModalRef = {
  openModal(): void
  closeModal(): void
} | undefined

export const DeleteMasterTeamModal = forwardRef<DeleteModalRef, TDeleteModal>((props, ref) => {
  const {
    selectedRecordsIds,
    isDeleteAllRecords,
    onDelete
  } = props

  const { notify, info } = useNotification()
  const { total } = useMasterTeamsSlice()

  const [isOpen, setIsOpen] = useState(false)
  const [bulkDeleteMT, { isLoading }] = useBulkDeleteMasterTeamsMutation()
  const deleteRecordsModalCount = isDeleteAllRecords ? total : selectedRecordsIds.length
  const deleteSeasonsText = deleteRecordsModalCount > 1 ? 'master teams' : 'master team'

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    }
  }, [])

  const handleDelete = () => {
    closeModal()
    const deleteHandler = isDeleteAllRecords ? bulkDeleteMT([]) : bulkDeleteMT(selectedRecordsIds)
    deleteHandler
      .unwrap()
      .then((response) => {
        onDelete && onDelete()

        const message = `${response.success}/${response.total}  master teams have been successfully removed.`

        if (response.status !== 'green') {
          info('More info...', message, PATH_TO_DELETING_INFO_MASTER_TEAMS)
          return
        }

        if (response.status === 'green') {
          notify(message, 'success')
        }
      })
  }

  if (isLoading) {
    return <Loader text={`Deleting ${deleteRecordsModalCount} records`} />
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <MonroeModal
      onCancel={closeModal}
      okText="Delete"
      onOk={handleDelete}
      title={`Delete ${deleteRecordsModalCount > 1 ? deleteRecordsModalCount : ''} ${deleteSeasonsText}?`}
      type="warn"
      content={
        <p>
          Are you sure you want to delete {deleteRecordsModalCount > 1 ? deleteRecordsModalCount : 'this'}{' '}
          {deleteSeasonsText}?
        </p>
      }
    />
  )
})
