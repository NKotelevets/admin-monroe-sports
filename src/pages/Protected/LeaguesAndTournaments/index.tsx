import { DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Flex } from 'antd'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import LeagueAndTournamentsTable from '@/pages/Protected/LeaguesAndTournaments/components/LeagueAndTournamentsTable'

import { CreateNewEntityButton, ImportButton, MonroeDeleteButton, PageContainer } from '@/components/Elements'
import ImportModal from '@/components/ImportTooltip'
import Loader from '@/components/Loader'
import MonroeModal from '@/components/MonroeModal'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useImportLeaguesCSVMutation } from '@/redux/leagues/leagues.api'
import { useBulkDeleteLeaguesMutation, useDeleteAllLeaguesMutation } from '@/redux/leagues/leagues.api'

import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/common/constants/import'
import {
  PATH_TO_CREATE_LEAGUE,
  PATH_TO_LEAGUES_DELETING_INFO,
  PATH_TO_LEAGUES_IMPORT_INFO,
} from '@/common/constants/paths'
import { IImportModalOptions } from '@/common/interfaces'

const Title = styled.h1`
  font-size: 20px;
  font-weight: 500;
  color: rgba(26, 22, 87, 0.85);
`

const LeaguesAndTournaments = () => {
  const navigate = useNavigate()
  const { total } = useLeagueSlice()
  const [selectedRecordsIds, setSelectedRecordsIds] = useState<string[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)
  const [isDeleteAllRecords, setIsDeleteAllRecords] = useState(false)
  const deleteRecordsModalCount = isDeleteAllRecords ? total : selectedRecordsIds.length
  const [deleteAll, deleteAllData] = useDeleteAllLeaguesMutation()
  const [bulkDelete, bulkDeleteData] = useBulkDeleteLeaguesMutation()
  const { setAppNotification, setInfoNotification, clearInfoNotification } = useAppSlice()
  const inputRef = useRef<HTMLInputElement | null>()
  const leagueTournText = deleteRecordsModalCount > 1 ? 'leagues/tournaments' : 'league/tournament'
  const [showCreatedRecords, setShowCreatedRecords] = useState(false)
  const [importLeagues] = useImportLeaguesCSVMutation()
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)
  const [fileKey, setFileKey] = useState('')

  const goToCreateLeagueTournamentPage = () => navigate(PATH_TO_CREATE_LEAGUE)

  const handleCloseModal = useCallback(() => setIsOpenModal(false), [])

  const handleDelete = async () => {
    handleCloseModal()
    const deleteHandler = isDeleteAllRecords ? deleteAll() : bulkDelete({ ids: selectedRecordsIds })
    await deleteHandler.unwrap().then((response) => {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
      setIsDeleteAllRecords(false)
      const message = `${response.success}/${response.total} ${response.total === 1 ? 'league/tournament' : 'leagues/tournaments'}  have been successfully removed.`

      if (response.status !== 'green') {
        setInfoNotification({
          actionLabel: 'More info..',
          message,
          redirectedPageUrl: PATH_TO_LEAGUES_DELETING_INFO,
        })

        return
      }

      if (response.status === 'green') {
        setAppNotification({
          message,
          timestamp: new Date().getTime(),
          type: 'success',
        })
      }
    })
  }

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

      await importLeagues(body)
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
            errorMessage: (error.data as { code: string; details: string }).details,
          })
        })

      setFileKey(new Date().toISOString())
    }
  }

  useEffect(() => {
    return () => {
      clearInfoNotification()
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Admin Panel | Leagues and Tournaments</title>
      </Helmet>

      {(deleteAllData.isLoading || bulkDeleteData.isLoading) && (
        <Loader text={`Deleting ${deleteRecordsModalCount} records`} />
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
            navigate(PATH_TO_LEAGUES_IMPORT_INFO)
          }}
          onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
        />
      )}

      {isOpenModal && (
        <MonroeModal
          onCancel={handleCloseModal}
          okText="Delete"
          onOk={handleDelete}
          title={`Delete ${deleteRecordsModalCount > 1 ? deleteRecordsModalCount : ''} ${leagueTournText}?`}
          type="warn"
          content={
            <p>
              Are you sure you want to delete {deleteRecordsModalCount > 1 ? deleteRecordsModalCount : ''}{' '}
              {leagueTournText}?
            </p>
          }
        />
      )}

      <BaseLayout>
        <PageContainer>
          <Flex justify="space-between" align="center" className="mg-b24">
            <Title>Leagues & Tournaments</Title>

            <Flex>
              {!!selectedRecordsIds.length && (
                <MonroeDeleteButton
                  type="default"
                  icon={<DeleteOutlined />}
                  iconPosition="start"
                  onClick={() => setIsOpenModal(true)}
                >
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

              <input
                ref={(ref) => {
                  inputRef.current = ref
                }}
                type="file"
                name="leagues"
                accept=".csv"
                onChange={handleChange}
                className="d-n"
                key={fileKey}
              />

              <CreateNewEntityButton
                icon={<PlusOutlined />}
                iconPosition="start"
                type="primary"
                onClick={goToCreateLeagueTournamentPage}
              >
                Create new leagues/tourns
              </CreateNewEntityButton>
            </Flex>
          </Flex>

          <Flex flex="1 1 auto" vertical>
            <LeagueAndTournamentsTable
              showCreatedRecords={showCreatedRecords}
              isDeleteAllRecords={isDeleteAllRecords}
              setSelectedRecordsIds={setSelectedRecordsIds}
              selectedRecordIds={selectedRecordsIds}
              showAdditionalHeader={showAdditionalHeader}
              setShowAdditionalHeader={setShowAdditionalHeader}
              setIsDeleteAllRecords={setIsDeleteAllRecords}
            />
          </Flex>
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default LeaguesAndTournaments
