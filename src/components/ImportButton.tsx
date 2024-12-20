import { useImportFile } from '@/hooks/useImportFile.tsx'
import { ChangeEvent, ReactElement, useState } from 'react'
import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/common/constants/import.ts'
import { IImportModalOptions } from '@/common/interfaces'
import ImportModal from '@/components/ImportModal.tsx'
import { useNavigate } from 'react-router-dom'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { TDeleteStatus } from '@/common/types'

interface TImportButtonProps {
  fileName?: string
  infoPath: string

  onChange(body: FormData): Promise<{ status: TDeleteStatus; message: string; }>
}

/**
 * ImportButton Component
 *
 * A button that allows users to upload and import a CSV file for master teams.
 * Displays a modal with the import status after the upload is processed.
 *
 * @returns {ReactElement} The ImportButton component.
 */
export const ImportButton = (props: TImportButtonProps): ReactElement => {
  const { infoPath, fileName = 'csv_file', onChange } = props
  const { setShowCreatedRecords } = useTableContext()
  const { Button, setFileKey } = useImportFile({
    buttonTitle: 'Import CSV',
    accept: '.csv'
  })

  const navigate = useNavigate()

  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)

  /**
   * Handles the file input change event.
   * Processes the selected CSV file, uploads it, and updates the import modal state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The file input change event.
   * @returns {Promise<void>} A promise resolving when the file is processed.
   */
  const onFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
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
      body.set(fileName, file)

      await onChange(body)
        .then(response => {
          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: response.status,
            errorMessage: response.message
          })
        })
        .catch(() => {

          setImportModalOptions({
            filename: file.name,
            isOpen: true,
            status: 'red',
            errorMessage: 'Something went wrong. Please try again!'
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
          showInList={() => setShowCreatedRecords(true)}
          redirectToImportInfo={() => {
            setImportModalOptions((prev) => ({ ...prev, isOpen: false }))
            navigate(infoPath)
          }}
          onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
      <Button onChange={onFile} />
    </>
  )
}
