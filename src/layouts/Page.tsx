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
  deleteTerm: {
    singular: string
    plural: string
  }

  onDelete(): void
}

interface IPageProps {
  title: string
  children: ReactElement
  selectedIds?: string[] | null
  deleteTerm?: IDeleteProps['deleteTerm']

  onCreate?(): void
  onDelete?(): void
  customControls?(): ReactElement
}

export const Page: FC<IPageProps> = (props) => {
  const {
    title,
    children,
    selectedIds = [],
    deleteTerm,
    onCreate,
    onDelete,
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
                  selectedIds={selectedIds}
                  onDelete={onDelete}
                  deleteTerm={deleteTerm}
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
  const { selectedIds, deleteTerm, onDelete } = props

  const [showModal, setShowModal] = useState(false)

  const deleteCount = selectedIds.length
  const deleteMany = deleteCount > 1
  const term = deleteMany ? deleteTerm.plural : deleteTerm.singular

  const openModal = useCallback(() => setShowModal(true),[])
  const closeModal = useCallback(() => setShowModal(false),[])

  const handleDelete = () => {
    // do stuff here like closing modal etc.
    onDelete()
  }

  return (
    <>
      {!!selectedIds.length && showModal && (
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

      <MonroeDeleteButton
        icon={<DeleteOutlined />}
        iconPosition="start"
        onClick={openModal}
      >
        Delete
      </MonroeDeleteButton>
    </>
  )

}

const Header = styled(Flex)`
`
const Controls = styled(Flex)`
`
