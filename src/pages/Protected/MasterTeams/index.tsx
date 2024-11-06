import MasterTeamsTable from './components/MasterTeamsTable'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Flex } from 'antd'
import { ChangeEvent, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import {
  CreateNewEntityButton,
  ImportButton,
  MonroeDeleteButton,
  PageContainer,
  ProtectedPageTitle
} from '@/components/Elements'
import ImportModal from '@/components/ImportModal.tsx'

import BaseLayout from '@/layouts/BaseLayout'
import { useMasterTeamsImportCSVMutation } from '@/redux/masterTeams/masterTeams.api'

import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/common/constants/import'
import { PATH_TO_CREATE_MASTER_TEAM, PATH_TO_MASTER_TEAMS_IMPORT_INFO } from '@/common/constants/paths'
import { IImportModalOptions } from '@/common/interfaces'
import {
  DeleteMasterTeamModal,
  DeleteModalRef
} from '@/pages/Protected/MasterTeams/components/DeleteMasterTeamModal.tsx'
import { ExportAvailabilityButton } from '@/pages/Protected/MasterTeams/components/ExportAvailabilityButton.tsx'

const MasterTeams = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>()
  const deleteModalRef = useRef<DeleteModalRef>()

  const [importSeasons] = useMasterTeamsImportCSVMutation()

  const [selectedRecordsIds, setSelectedRecordsIds] = useState<string[]>([])
  const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)
  const [isDeleteAllRecords, setIsDeleteAllRecords] = useState(false)
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)

  const [fileKey, setFileKey] = useState('')

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setImportModalOptions(DEFAULT_IMPORT_MODAL_OPTIONS)
    const file = event.target.files?.[0]

    if (file) {
      setImportModalOptions({
        filename: file.name,
        isOpen: true,
        status: 'loading',
        errorMessage: ''
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
            errorMessage: ''
          })
        })
        .catch((error) => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'red',
            errorMessage: (error.data as { code: string; detail: string }).detail
          })
        })

      setFileKey(new Date().toISOString())
    }
  }

  const onDelete = () => {
    setSelectedRecordsIds([])
    setShowAdditionalHeader(false)
    setIsDeleteAllRecords(false)
  }

  return (
    <BaseLayout>
      <>
        <Helmet>
          <title>Admin Panel | Master Teams </title>
        </Helmet>

        <DeleteMasterTeamModal
          ref={deleteModalRef}
          onDelete={onDelete}
          isDeleteAllRecords={isDeleteAllRecords}
          selectedRecordsIds={selectedRecordsIds}
        />

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
                <MonroeDeleteButton icon={<DeleteOutlined />} iconPosition="start" onClick={deleteModalRef?.current?.openModal}>
                  Delete
                </MonroeDeleteButton>
              )}

              <ExportAvailabilityButton />

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
            className="d-n"
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

