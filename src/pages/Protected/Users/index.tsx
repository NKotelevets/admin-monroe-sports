import UsersTable from './components/UsersTable'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined'
import { Flex } from 'antd'
import { useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import {
  CreateNewEntityButton,
  ImportButton,
  MonroeDeleteButton,
  MonroeSecondaryButton,
  PageContainer,
  ProtectedPageTitle,
} from '@/components/Elements'
import ImportModal from '@/components/ImportTooltip'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { PATH_TO_CREATE_USER, PATH_TO_USERS_BULK_EDIT, PATH_TO_USERS_IMPORT_INFO } from '@/constants/paths'

import { IImportModalOptions } from '@/common/interfaces'

import EditIcon from '@/assets/icons/black-edit.svg'
import SmallLockIcon from '@/assets/icons/small-lock.svg'

const Users = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedRecordsIds, setSelectedRecordsIds] = useState<string[]>([])
  const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>({
    filename: '',
    isOpen: false,
    status: 'loading',
    errorMessage: '',
  })
  const inputRef = useRef<HTMLInputElement | null>()
  const navigate = useNavigate()
  const [isBlockAllUsers, setIsBlockAllUsers] = useState(false)
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
  const blockUsersModalCount = isBlockAllUsers ? 2 : selectedRecordsIds.length
  const blockUsersText = blockUsersModalCount > 1 ? 'users' : 'user'

  const handleCloseModal = useCallback(() => setIsOpenModal(false), [])

  const handleChange = () => {}

  const handleBlock = () => {
    handleCloseModal()
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Users</title>
      </Helmet>

      {isOpenModal && (
        <MonroeModal
          onCancel={handleCloseModal}
          okText="Delete"
          onOk={handleBlock}
          title={`Delete ${blockUsersModalCount > 1 ? blockUsersModalCount : ''} ${blockUsersText}?`}
          type="warn"
          content={
            <p>
              Are you sure you want to block {blockUsersModalCount > 1 ? blockUsersModalCount : 'this'} {blockUsersText}
              ?
            </p>
          }
        />
      )}

      {importModalOptions.isOpen && (
        <ImportModal
          title="Importing"
          filename={importModalOptions.filename}
          status={importModalOptions.status}
          errorMessage={importModalOptions.errorMessage}
          showInList={() => setShowCreatedRecords(true)}
          redirectToImportInfo={() => {
            setImportModalOptions((prev) => ({ ...prev, isOpen: false }))
            navigate(PATH_TO_USERS_IMPORT_INFO)
          }}
          onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      <BaseLayout>
        <PageContainer>
          <Flex justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>Users</ProtectedPageTitle>

            <Flex>
              {!!selectedRecordsIds.length && (
                <Flex>
                  <MonroeDeleteButton
                    type="default"
                    icon={<ReactSVG src={SmallLockIcon} />}
                    iconPosition="start"
                    onClick={() => setIsOpenModal(true)}
                  >
                    Block users
                  </MonroeDeleteButton>

                  <MonroeSecondaryButton
                    type="default"
                    icon={<ReactSVG src={EditIcon} />}
                    iconPosition="start"
                    onClick={() => navigate(PATH_TO_USERS_BULK_EDIT)}
                  >
                    Bulk Edit
                  </MonroeSecondaryButton>

                  <ImportButton
                    icon={<UploadOutlined />}
                    iconPosition="start"
                    type="default"
                    onClick={() => {
                      inputRef.current?.click()
                    }}
                  >
                    Export CSV
                  </ImportButton>
                </Flex>
              )}

              {!selectedRecordsIds.length && (
                <ImportButton
                  icon={<DownloadOutlined />}
                  iconPosition="start"
                  type="default"
                  onClick={() => {
                    inputRef.current?.click()
                  }}
                >
                  Import CSV
                </ImportButton>
              )}

              <CreateNewEntityButton
                icon={<PlusOutlined />}
                iconPosition="start"
                type="primary"
                onClick={() => navigate(PATH_TO_CREATE_USER)}
              >
                Create new user
              </CreateNewEntityButton>
            </Flex>
          </Flex>

          <input
            ref={(ref) => {
              inputRef.current = ref
            }}
            type="file"
            name="seasons"
            accept=".csv"
            onChange={handleChange}
            style={{ display: 'none' }}
          />

          <Flex flex="1 1 auto" vertical>
            <UsersTable
              isBlockAllUsers={isBlockAllUsers}
              setSelectedRecordsIds={setSelectedRecordsIds}
              selectedRecordIds={selectedRecordsIds}
              showAdditionalHeader={showAdditionalHeader}
              setShowAdditionalHeader={setShowAdditionalHeader}
              setIsDeleteAllRecords={setIsBlockAllUsers}
              showCreatedRecords={showCreatedRecords}
            />
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default Users

