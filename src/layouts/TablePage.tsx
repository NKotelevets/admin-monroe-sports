import { CreateNewEntityButton, MonroeDeleteButton } from '@/components/Elements'
import { FC, useCallback, useState } from 'react'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import MonroeModal from '@/components/MonroeModal.tsx'
import { IPageProps, Page } from './Page'
import { useTableContext } from '@/hooks/useTableContext.ts'

interface IDeleteProps {
  selectedIds: string[]
  singleDeleting: boolean
  deleteTerm: {
    singular: string
    plural: string
  }

  onClose?(): void

  onDelete(): void
}

interface ITablePageProps extends IPageProps {
  deleteTerm?: IDeleteProps['deleteTerm']

  onCreate?(): void

  onDelete?(): void

  onDeleteModalClose?(): void
}

export const TablePage: FC<ITablePageProps> = (props) => {
  const {
    title,
    children,
    deleteTerm,
    onCreate,
    onDelete,
    controls
  } = props

  const {
    selectedIds,
    setSelectedIds,
    singleDeleting,
    setSingleDeleting
  } = useTableContext()

  const onDeleteModalClose = useCallback(() => {
    if (singleDeleting) {
      setSelectedIds([])
    }
    setSingleDeleting(false)
  }, [singleDeleting])

  const renderControls = useCallback(() => (
    <>
      {!!selectedIds?.length && onDelete && deleteTerm && (
        <Delete
          onClose={onDeleteModalClose}
          selectedIds={selectedIds}
          onDelete={onDelete}
          deleteTerm={deleteTerm}
          singleDeleting={singleDeleting}
        />
      )}

      {!!controls && controls()}

      {!!onCreate && (
        <CreateNewEntityButton
          icon={<PlusOutlined />}
          iconPosition="start"
          type="primary"
          onClick={onCreate}
        >
          Create {title.toLowerCase()}
        </CreateNewEntityButton>
      )}
    </>
  ), [selectedIds, deleteTerm, singleDeleting, title])

  return (
    <Page
      title={title}
      controls={renderControls}
    >
      {children}
    </Page>
  )
}


const Delete = (props: IDeleteProps) => {
  const {
    selectedIds,
    deleteTerm,
    singleDeleting,
    onDelete,
    onClose
  } = props

  const [showModal, setShowModal] = useState(false)

  const deleteCount = selectedIds.length
  const deleteMany = deleteCount > 1
  const term = deleteMany ? deleteTerm.plural : deleteTerm.singular

  const openModal = useCallback(() => setShowModal(true), [])
  const closeModal = useCallback(() => {
    setShowModal(false)
    onClose && onClose()
  }, [])

  const handleDelete = () => {
    // do stuff here like closing modal etc.
    onDelete()
  }

  return (
    <>
      {!!selectedIds.length && (showModal || singleDeleting) && (
        <MonroeModal
          onCancel={closeModal}
          okText="Delete"
          onOk={handleDelete}
          title={`Delete ${deleteMany ? deleteCount : ''} ${term}?`}
          type="warn"
          content={
            <p>
              Are you sure you want to delete {deleteMany ? deleteCount : 'this'} {term} ?
            </p>
          }
        />
      )}

      {!!selectedIds.length && !singleDeleting && (
        <MonroeDeleteButton
          icon={<DeleteOutlined />}
          iconPosition="start"
          onClick={openModal}
        >
          Delete
        </MonroeDeleteButton>
      )}
    </>
  )

}
