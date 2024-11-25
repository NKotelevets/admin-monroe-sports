import { CreateNewEntityButton, MonroeDeleteButton } from '@/components/Elements'
import { FC, ReactElement, useCallback, useState } from 'react'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import MonroeModal from '@/components/MonroeModal.tsx'
import { IPageProps, Page } from './Page'
import { useTableContext } from '@/hooks/useTableContext.ts'

/**
 * Interface for the props of the Delete component.
 *
 * @property {string[]} selectedIds - An array of IDs representing the items selected for deletion.
 * @property {boolean} singleDeleting - A flag indicating if a single item is being deleted.
 * @property {object} deleteTerm - An object specifying the singular and plural terms used in delete messages.
 * @property {string} deleteTerm.singular - The singular term for the item being deleted (e.g., "user").
 * @property {string} deleteTerm.plural - The plural term for the items being deleted (e.g., "users").
 * @property {() => void} [onClose] - An optional callback function that is triggered when the delete modal is closed.
 * @property {() => void} onDelete - A callback function that is triggered when the delete action is confirmed.
 */
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

/**
 * Interface for the props of the TablePage component, extending IPageProps.
 *
 * @extends IPageProps
 * @property {IDeleteProps['deleteTerm']} [deleteTerm] - Optional delete term for managing deletion messages.
 * @property {() => void} [onCreate] - An optional callback function for creating a new entity.
 * @property {() => void} [onDelete] - An optional callback function for performing the delete action.
 * @property {() => void} [onDeleteModalClose] - An optional callback function for closing the delete modal.
 */
interface ITablePageProps extends IPageProps {
  deleteTerm?: IDeleteProps['deleteTerm']
  onCreate?(): void
  onDelete?(): void
  onDeleteModalClose?(): void
}

/**
 * A component that provides a layout for displaying and controlling a table providing context and create and delete functionalities.
 * It includes controls for deleting selected items, creating new items, and additional user-provided controls.
 *
 * @param {ITablePageProps} props - The props for the TablePage component, including title, children, delete terms, and event handlers.
 * @returns {ReactElement} The rendered TablePage component.
 */
export const TablePage: FC<ITablePageProps> = (props: ITablePageProps): ReactElement => {
  const { title, children, deleteTerm, onCreate, onDelete, controls } = props
  const { selectedIds, setSelectedIds, singleDeleting, setSingleDeleting } = useTableContext()

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

/**
 * A Delete component that handles the deletion of selected items and displays a modal for confirmation.
 *
 * @param {IDeleteProps} props - The props for the Delete component, including selected IDs, delete terms, and event handlers.
 * @returns {ReactElement} The rendered Delete component.
 */
const Delete = (props: IDeleteProps): ReactElement => {
  const { selectedIds, deleteTerm, singleDeleting, onDelete, onClose } = props
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
              Are you sure you want to delete {deleteMany ? deleteCount : 'this'} {term}?
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
