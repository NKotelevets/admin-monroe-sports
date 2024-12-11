import { useImportFile } from '@/hooks/useImportFile.tsx'
import { ChangeEvent, ReactElement, useState } from 'react'
import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/common/constants/import.ts'
import { useMasterTeamsImportCSVMutation } from '@/redux/masterTeams/masterTeams.api.ts'
import { IImportModalOptions } from '@/common/interfaces'
import ImportModal from '@/components/ImportModal.tsx'
import { PATH_TO_MASTER_TEAMS_IMPORT_INFO } from '@/common/constants/paths.ts'
import { useNavigate } from 'react-router-dom'

/**
 * ImportButton Component
 *
 * A button that allows users to upload and import a CSV file for master teams.
 * Displays a modal with the import status after the upload is processed.
 *
 * @returns {ReactElement} The ImportButton component.
 */
export const ImportButton = (): ReactElement => {
  const navigate = useNavigate()

  const { Button, setFileKey } = useImportFile({
    buttonTitle: 'Import CSV',
    accept: '.csv'
  })

  const [importMasterTeamCSV] = useMasterTeamsImportCSVMutation()
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)

  /**
   * Handles the file input change event.
   * Processes the selected CSV file, uploads it, and updates the import modal state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The file input change event.
   * @returns {Promise<void>} A promise resolving when the file is processed.
   */
  const onChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
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

      await importMasterTeamCSV(body)
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
        <ImportModal
          title="Importing"
          filename={importModalOptions.filename}
          status={importModalOptions.status}
          errorMessage={importModalOptions.errorMessage}
          showInList={() => {
          }}
          redirectToImportInfo={() => {
            setImportModalOptions((prev) => ({ ...prev, isOpen: false }))
            navigate(PATH_TO_MASTER_TEAMS_IMPORT_INFO)
          }}
          onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
      <Button onChange={onChange} />
    </>
  )
}
