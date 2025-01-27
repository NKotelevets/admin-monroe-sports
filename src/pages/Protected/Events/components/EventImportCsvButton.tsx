import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import { Dropdown, MenuProps } from 'antd'
import { ChangeEvent, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/Button.tsx'
import ImportModal from '@/components/ImportModal.tsx'

import { useImportEventsCSVMutation } from '@/redux/events/events.api.ts'

import { useTableContext } from '@/hooks/useTableContext.ts'

import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/common/constants/import.ts'
import { PATH_TO_EVENTS_IMPORT_INFO } from '@/common/constants/paths.ts'
import { IImportModalOptions } from '@/common/interfaces'

export const EventImportCsvButton = () => {
  const { setShowCreatedRecords } = useTableContext()

  const [importEvents] = useImportEventsCSVMutation()
  const [importType, setImportType] = useState<'playoffs' | 'others' | undefined>()
  const [importModalOptions, setImportModalOptions] = useState<IImportModalOptions>(DEFAULT_IMPORT_MODAL_OPTIONS)

  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>()
  const items = [
    {
      label: 'Import Games/Practices/Other events',
      key: '1',
    },
    {
      label: 'Import Playoffs',
      key: '2',
    },
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setImportType(key === '1' ? 'others' : 'playoffs')
    inputRef.current?.click()
  }

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const body = new FormData()
    body.set('file', file)

    importEvents({ file: body, importType: importType! })
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
          errorMessage:
            (
              error.data as {
                code: string
                error: string
              }
            )?.error ||
            error.data?.detail ||
            'Something went wrong. Please, try again',
        })
      })
  }

  return (
    <>
      {importModalOptions.isOpen &&
        createPortal(
          <ImportModal
            title="Importing"
            filename={importModalOptions.filename}
            status={importModalOptions.status}
            errorMessage={importModalOptions.errorMessage}
            showInList={() => setShowCreatedRecords(true)}
            redirectToImportInfo={() => {
              setImportModalOptions((prev) => ({ ...prev, isOpen: false }))
              navigate(PATH_TO_EVENTS_IMPORT_INFO)
            }}
            onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
          />,
          document.getElementById('page-portal')!,
        )}
      <Dropdown menu={{ items, onClick }} trigger={['click']} placement="bottomRight" rootClassName="custom-dropdown">
        <Button icon={<DownloadOutlined />} iconPosition="start" type="default" onClick={(e) => e.preventDefault()}>
          Import CSV
        </Button>
      </Dropdown>
      <input
        ref={(ref) => {
          inputRef.current = ref
        }}
        type="file"
        name="import-files-input"
        accept={'text/csv'}
        onChange={onUpload}
        className="d-n"
      />
    </>
  )
}
