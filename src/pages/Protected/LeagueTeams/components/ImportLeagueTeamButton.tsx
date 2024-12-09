import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import { ImportButton } from '@/components/Elements'
import { ChangeEvent, useRef, useState } from 'react'
import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/common/constants/import.ts'
import { IImportModalOptions } from '@/common/interfaces'
import ImportModal from '@/components/ImportModal.tsx'
import { PATH_TO_LEAGUE_TEAM_IMPORT_INFO } from '@/common/constants/paths.ts'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useLeagueTeamsImportCSVMutation } from '@/redux/leagueTeams/leagueTeams.api.ts'

export const ImportLeagueTeamButton = () => {
  const inputRef = useRef<HTMLInputElement | null>()
  const navigate = useNavigate()

  const [fileKey, setFileKey] = useState('')
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)

  const [importLeagueTeamCSV] = useLeagueTeamsImportCSVMutation()

  const onCSVInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
      body.set('csv_file', file)

      await importLeagueTeamCSV(body)
        .unwrap()
        .then(response => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: response.status,
            errorMessage: ''
          })
        })
        .catch((error) => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'red',
            errorMessage: (error.data as {
              code: string;
              error: string
            })?.error || error.data?.detail || 'Something went wrong. Please, try again'
          })
        })

      setFileKey(new Date().toISOString())
    }
  }

  return (
    <>
      {importModalOptions.isOpen && (
        createPortal(
          <ImportModal
            title="Importing"
            filename={importModalOptions.filename}
            status={importModalOptions.status}
            errorMessage={importModalOptions.errorMessage}
            showInList={alert}
            redirectToImportInfo={() => {
              setImportModalOptions((prev) => ({ ...prev, isOpen: false }))
              navigate(PATH_TO_LEAGUE_TEAM_IMPORT_INFO)
            }}
            onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
          />, document.getElementById('page-portal')!)
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
        name="masterTeams"
        accept=".csv"
        onChange={onCSVInputChange}
        className="d-n"
        key={fileKey}
      />
    </>
  )
}
