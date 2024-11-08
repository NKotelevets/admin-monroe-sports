import { Helmet } from 'react-helmet'
import { CreateNewEntityButton, MonroeDeleteButton, PageContainer, ProtectedPageTitle } from '@/components/Elements'
import { Flex } from 'antd'
import BaseLayout from '@/layouts/BaseLayout'
import { FC, ReactElement, useCallback, useState } from 'react'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import styled from '@emotion/styled'
import MonroeModal from '@/components/MonroeModal.tsx'

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

interface IPageProps {
  title: string
  children: ReactElement
  selectedIds?: string[] | null
  singleDeleting?: boolean
  deleteTerm?: IDeleteProps['deleteTerm']

  onCreate?(): void
  onDelete?(): void
  onDeleteModalClose?(): void
  customControls?(): ReactElement
}

export const Page: FC<IPageProps> = (props) => {
  const {
    title,
    children,
    selectedIds = [],
    singleDeleting = false,
    deleteTerm,
    onCreate,
    onDelete,
    onDeleteModalClose,
    customControls
  } = props

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | {title} </title>
        </Helmet>

        <PageContainer>
          <Header justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>{title}</ProtectedPageTitle>

            <Controls>
              {!!selectedIds?.length && onDelete && deleteTerm && (
                <Delete
                  onClose={onDeleteModalClose}
                  selectedIds={selectedIds}
                  onDelete={onDelete}
                  deleteTerm={deleteTerm}
                  singleDeleting={singleDeleting}
                />
              )}

              {!!customControls && customControls()}

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
            </Controls>
          </Header>

          <Flex flex="1 1 auto" vertical>
            {children}
          </Flex>
        </PageContainer>
      </>
    </BaseLayout>
  )
}


const Delete = (props: IDeleteProps) => {
  const {
    selectedIds,
    deleteTerm,
    singleDeleting,
    onDelete,
    onClose,
  } = props

  const [showModal, setShowModal] = useState(false)

  const deleteCount = selectedIds.length
  const deleteMany = deleteCount > 1
  const term = deleteMany ? deleteTerm.plural : deleteTerm.singular

  const openModal = useCallback(() => setShowModal(true),[])
  const closeModal = useCallback(() => {
    setShowModal(false)
    onClose && onClose()
  },[])

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

const Header = styled(Flex)`
`
const Controls = styled(Flex)`
`
