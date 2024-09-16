import MasterTeamsTable from './components/MasterTeamsTable'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex } from 'antd'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import {
  CreateNewEntityButton,
  ImportButton,
  MonroeDeleteButton,
  PageContainer,
  ProtectedPageTitle,
} from '@/components/Elements'
import ImportModal from '@/components/ImportTooltip'
import Loader from '@/components/Loader'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

// import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import {
  useMasterTeamsBulkDeleteMutation,
  useMasterTeamsDeleteAllMutation,
  useMasterTeamsImportCSVMutation,
} from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_CREATE_MASTER_TEAM, PATH_TO_MASTER_TEAMS_IMPORT_INFO } from '@/constants/paths'

import { IImportModalOptions } from '@/common/interfaces'

const DEFAULT_IMPORT_MODAL_OPTIONS: IImportModalOptions = {
  filename: '',
  isOpen: false,
  status: 'loading',
  errorMessage: '',
}

const MasterTeams = () => {
  const { total } = useMasterTeamsSlice()
  // const { setInfoNotification, setAppNotification } = useAppSlice()
  const [bulkDeleteSeasons, bulkDeleteSeasonsData] = useMasterTeamsBulkDeleteMutation()
  const [deleteAllSeasons, deleteAllSeasonsData] = useMasterTeamsDeleteAllMutation()
  const [importSeasons] = useMasterTeamsImportCSVMutation()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedRecordsIds, setSelectedRecordsIds] = useState<string[]>([])
  const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)
  const [isDeleteAllRecords, setIsDeleteAllRecords] = useState(false)
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>()
  const navigate = useNavigate()
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)
  const deleteRecordsModalCount = isDeleteAllRecords ? total : selectedRecordsIds.length
  const deleteSeasonsText = deleteRecordsModalCount > 1 ? 'seasons' : 'season'
  const [fileKey, setFileKey] = useState('')

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

      await importSeasons(body)
        .unwrap()
        .then(() => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'green', // TODO: fix this issue
            errorMessage: '',
          })
        })
        .catch((error) => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'red',
            errorMessage: (error.data as { code: string; detail: string }).detail,
          })
        })

      setFileKey(new Date().toISOString())
    }
  }

  const handleCloseModal = useCallback(() => setIsOpenModal(false), [])

  const handleDelete = () => {
    handleCloseModal()
    const deleteHandler = isDeleteAllRecords ? deleteAllSeasons() : bulkDeleteSeasons({ ids: selectedRecordsIds })
    deleteHandler.unwrap().then(() => {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
      setIsDeleteAllRecords(false)

      // if (response.status !== 'green') {
      //   setInfoNotification({
      //     actionLabel: 'More info..',
      //     message: `${response.success}/${response.total} seasons have been successfully removed.`,
      //     redirectedPageUrl: PATH_TO_SEASONS_DELETING_INFO,
      //   })

      //   return
      // }

      // if (response.status === 'green') {
      //   setAppNotification({
      //     message: `${response.success}/${response.total} seasons have been successfully removed.`,
      //     timestamp: new Date().getTime(),
      //     type: 'success',
      //   })
      // }
    })
  }

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Master Teams </title>
        </Helmet>

        {(bulkDeleteSeasonsData.isLoading || deleteAllSeasonsData.isLoading) && (
          <Loader text={`Deleting ${deleteRecordsModalCount} records`} />
        )}

        {isOpenModal && (
          <MonroeModal
            onCancel={handleCloseModal}
            okText="Delete"
            onOk={handleDelete}
            title={`Delete ${deleteRecordsModalCount > 1 ? deleteRecordsModalCount : ''} ${deleteSeasonsText}?`}
            type="warn"
            content={
              <>
                <p>
                  Are you sure you want to delete {deleteRecordsModalCount > 1 ? deleteRecordsModalCount : 'this'}{' '}
                  {deleteSeasonsText}?
                </p>
              </>
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
              navigate(PATH_TO_MASTER_TEAMS_IMPORT_INFO)
            }}
            onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
          />
        )}

        <PageContainer>
          <Flex justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>Master Teams</ProtectedPageTitle>

            <Flex>
              {!!selectedRecordsIds.length && (
                <MonroeDeleteButton icon={<DeleteOutlined />} iconPosition="start" onClick={() => setIsOpenModal(true)}>
                  Delete
                </MonroeDeleteButton>
              )}

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

              <CreateNewEntityButton
                icon={<PlusOutlined />}
                iconPosition="start"
                type="primary"
                onClick={() => navigate(PATH_TO_CREATE_MASTER_TEAM)}
              >
                Create master team
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
            key={fileKey}
          />

          <Flex flex="1 1 auto" vertical>
            <MasterTeamsTable
              isDeleteAllRecords={isDeleteAllRecords}
              setSelectedRecordsIds={setSelectedRecordsIds}
              selectedRecordIds={selectedRecordsIds}
              showAdditionalHeader={showAdditionalHeader}
              setShowAdditionalHeader={setShowAdditionalHeader}
              setIsDeleteAllRecords={setIsDeleteAllRecords}
              showCreatedRecords={showCreatedRecords}
            />
          </Flex>
        </PageContainer>
      </>
    </BaseLayout>
  )
}

export default MasterTeams

