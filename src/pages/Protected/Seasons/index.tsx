import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import Flex from 'antd/es/flex'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import SeasonsTable from '@/pages/Protected/Seasons/components/SeasonsTable'

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

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import {
  useBulkSeasonsDeleteMutation,
  useDeleteAllSeasonsMutation,
  useImportSeasonsCSVMutation,
} from '@/redux/seasons/seasons.api'

import { PATH_TO_CREATE_SEASON, PATH_TO_SEASONS_DELETING_INFO, PATH_TO_SEASONS_IMPORT_INFO } from '@/constants/paths'

import { IImportModalOptions } from '@/common/interfaces'

const Seasons = () => {
  const { total } = useSeasonSlice()
  const { setInfoNotification, setAppNotification } = useAppSlice()
  const [bulkDeleteSeasons, bulkDeleteSeasonsData] = useBulkSeasonsDeleteMutation()
  const [deleteAllSeasons, deleteAllSeasonsData] = useDeleteAllSeasonsMutation()
  const [importSeasons] = useImportSeasonsCSVMutation()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedRecordsIds, setSelectedRecordsIds] = useState<string[]>([])
  const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)
  const [isDeleteAllRecords, setIsDeleteAllRecords] = useState(false)
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>()
  const navigate = useNavigate()
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>({
    filename: '',
    isOpen: false,
    status: 'loading',
    errorMessage: '',
  })
  const deleteRecordsModalCount = isDeleteAllRecords ? total : selectedRecordsIds.length
  const deleteSeasonsText = deleteRecordsModalCount > 1 ? 'seasons' : 'season'

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
        .then((response) => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: response.status,
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
    }
  }

  const handleCloseModal = useCallback(() => setIsOpenModal(false), [])

  const handleDelete = () => {
    handleCloseModal()
    const deleteHandler = isDeleteAllRecords ? deleteAllSeasons() : bulkDeleteSeasons({ ids: selectedRecordsIds })
    deleteHandler.unwrap().then((response) => {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
      setIsDeleteAllRecords(false)

      if (response.status !== 'green') {
        setInfoNotification({
          actionLabel: 'More info..',
          message: `${response.success}/${response.total} seasons have been successfully removed.`,
          redirectedPageUrl: PATH_TO_SEASONS_DELETING_INFO,
        })

        return
      }

      if (response.status === 'green') {
        setAppNotification({
          message: `${response.success}/${response.total} seasons have been successfully removed.`,
          timestamp: new Date().getTime(),
          type: 'success',
        })
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Seasons</title>
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
            navigate(PATH_TO_SEASONS_IMPORT_INFO)
          }}
          onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      <BaseLayout>
        <PageContainer>
          <Flex justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>Seasons</ProtectedPageTitle>

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
                onClick={() => navigate(PATH_TO_CREATE_SEASON)}
              >
                Create new season
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
            <SeasonsTable
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
      </BaseLayout>
    </>
  )
}

export default Seasons
