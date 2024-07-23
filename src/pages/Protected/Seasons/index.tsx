import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined'
import Button from 'antd/es/button/button'
import Flex from 'antd/es/flex'
import Typography from 'antd/es/typography'
import { CSSProperties, ChangeEvent, useCallback, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import SeasonsTable from '@/pages/Protected/Seasons/components/SeasonsTable'

import ImportModal from '@/components/ImportTooltip'
import Loader from '@/components/Loader'
import MonroeButton from '@/components/MonroeButton'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import {
  useBulkSeasonsDeleteMutation,
  useDeleteAllSeasonsMutation,
  useImportSeasonsCSVMutation,
} from '@/redux/seasons/seasons.api'

import { PATH_TO_SEASONS_CREATE, PATH_TO_SEASONS_DELETING_INFO, PATH_TO_SEASONS_IMPORT_INFO } from '@/constants/paths'

const createNewSeasonStyles: CSSProperties = {
  borderRadius: '2px',
  border: '1px solid #BC261B',
  background: '#BC261B',
  boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.04)',
  fontSize: '14px',
  fontWeight: 400,
  height: '32px',
}

const titleStyle: CSSProperties = {
  fontSize: '20px',
  fontWeight: 500,
  color: 'rgba(26, 22, 87, 0.85)',
}

const containerStyle: CSSProperties = {
  padding: '16px 24px',
  overflow: 'auto',
  height: '100%',
}

interface IImportModalOptions {
  filename: string
  errorMessage?: string
  status: 'loading' | 'red' | 'green' | 'yellow'
  isOpen: boolean
}

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
          if (response.status === 'green') {
            setImportModalOptions({
              filename: file.name,
              isOpen: true,
              status: 'green',
              errorMessage: '',
            })
          }

          if (response.status === 'red') {
            setImportModalOptions({
              filename: file.name,
              isOpen: true,
              status: 'red',
              errorMessage: '',
            })
          }

          if (response.status === 'yellow') {
            setImportModalOptions({
              filename: file.name,
              isOpen: true,
              status: 'yellow',
              errorMessage: '',
            })
          }
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

  const deleteRecordsModalCount = isDeleteAllRecords ? total : selectedRecordsIds.length
  const deleteSeasonsText = deleteRecordsModalCount > 1 ? 'seasons' : 'season'

  const handleCloseModal = useCallback(() => setIsOpenModal(false), [])

  const handleDelete = () => {
    handleCloseModal()

    if (isDeleteAllRecords) {
      deleteAllSeasons()
        .unwrap()
        .then((response) => {
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
    } else {
      bulkDeleteSeasons({ ids: selectedRecordsIds })
        .unwrap()
        .then((response) => {
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
                Are you sure you want to delete {deleteRecordsModalCount > 1 ? deleteRecordsModalCount : ''}{' '}
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
        <Flex vertical style={containerStyle}>
          <Flex
            justify="space-between"
            align="center"
            vertical={false}
            style={{
              marginBottom: '24px',
            }}
          >
            <Typography.Title style={titleStyle}>Seasons</Typography.Title>

            <Flex>
              {!!selectedRecordsIds.length && (
                <MonroeButton
                  isDisabled={false}
                  label="Delete"
                  type="default"
                  icon={<DeleteOutlined />}
                  iconPosition="start"
                  onClick={() => setIsOpenModal(true)}
                  className="view-delete-button"
                />
              )}

              <Button
                className="import-button"
                icon={<UploadOutlined />}
                iconPosition="start"
                type="default"
                onClick={() => {
                  inputRef.current?.click()
                }}
              >
                Import CSV
              </Button>

              <Button
                icon={<PlusOutlined />}
                iconPosition="start"
                type="primary"
                style={createNewSeasonStyles}
                onClick={() => navigate(PATH_TO_SEASONS_CREATE)}
              >
                Create new season
              </Button>
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
        </Flex>
      </BaseLayout>
    </>
  )
}

export default Seasons

