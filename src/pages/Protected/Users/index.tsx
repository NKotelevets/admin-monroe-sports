import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined'
import { Flex } from 'antd'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import UsersTable from '@/pages/Protected/Users/components/UsersTable'

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

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useBulkBlockUsersMutation, useImportUsersCSVMutation } from '@/redux/user/user.api'

import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/constants/import'
import {
  PATH_TO_CREATE_USER,
  PATH_TO_USERS_BLOCKING_INFO,
  PATH_TO_USERS_BULK_EDIT,
  PATH_TO_USERS_IMPORT_INFO,
} from '@/constants/paths'

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
  const { total } = useUserSlice()
  const [isSelectedAllUsers, setIsSelectedAllUsers] = useState(false)
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
  const blockUsersModalCount = isSelectedAllUsers ? total : selectedRecordsIds.length
  const blockUsersText = blockUsersModalCount > 1 ? 'users' : 'user'
  const [blockUsers] = useBulkBlockUsersMutation()
  const { setInfoNotification, setAppNotification } = useAppSlice()
  const [importUsersCSV] = useImportUsersCSVMutation()
  const [fileKey, setFileKey] = useState('')

  const handleCloseModal = useCallback(() => setIsOpenModal(false), [])

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setImportModalOptions(DEFAULT_IMPORT_MODAL_OPTIONS)
    const file = event.target.files?.[0]

    if (file) {
      setImportModalOptions({
        filename: file.name,
        isOpen: true,
        status: 'loading',
        errorMessage: '',
      })

      const body = new FormData()
      body.set('file', file)

      await importUsersCSV(body)
        .unwrap()
        .then(() => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'green',
            errorMessage: '',
          })
        })
        .catch((error) => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'red',
            errorMessage: (error.data as { code: string; details: string }).details,
          })
        })

      setFileKey(new Date().toISOString())
    }
  }

  const handleBlock = () => {
    handleCloseModal()
    const blockHandler = isSelectedAllUsers ? blockUsers([]) : blockUsers(selectedRecordsIds)

    blockHandler.unwrap().then((response) => {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
      setIsSelectedAllUsers(false)

      if (response.status !== 'green') {
        setInfoNotification({
          actionLabel: 'More info...',
          message: `Cannot block users.`,
          redirectedPageUrl: PATH_TO_USERS_BLOCKING_INFO,
        })

        return
      }

      if (response.status === 'green') {
        setAppNotification({
          message: `${response.success}/${response.total} users have been successfully blocked.`,
          timestamp: new Date().getTime(),
          type: 'success',
        })
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Users</title>
      </Helmet>

      {isOpenModal && (
        <MonroeModal
          onCancel={handleCloseModal}
          okText="Block"
          onOk={handleBlock}
          title={`Block ${blockUsersModalCount > 1 ? blockUsersModalCount : ''} ${blockUsersText}?`}
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

                  {!isSelectedAllUsers && (
                    <MonroeSecondaryButton
                      type="default"
                      icon={<ReactSVG src={EditIcon} />}
                      iconPosition="start"
                      onClick={() => navigate(PATH_TO_USERS_BULK_EDIT)}
                    >
                      {selectedRecordsIds.length === 1 ? 'Edit roles' : 'Bulk edit'}
                    </MonroeSecondaryButton>
                  )}

                  <ImportButton icon={<UploadOutlined />} iconPosition="start" type="default">
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
            name="users"
            accept=".csv"
            onChange={handleChange}
            style={{ display: 'none' }}
            key={fileKey}
          />

          <Flex flex="1 1 auto" vertical>
            <UsersTable
              isBlockAllUsers={isSelectedAllUsers}
              setSelectedRecordsIds={setSelectedRecordsIds}
              selectedRecordIds={selectedRecordsIds}
              showAdditionalHeader={showAdditionalHeader}
              setShowAdditionalHeader={setShowAdditionalHeader}
              setIsDeleteAllRecords={setIsSelectedAllUsers}
              showCreatedRecords={showCreatedRecords}
            />
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default Users

