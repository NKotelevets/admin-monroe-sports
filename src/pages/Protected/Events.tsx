import DownloadOutlined from '@ant-design/icons/lib/icons/DownloadOutlined'
import Flex from 'antd/es/flex'
import { ChangeEvent, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'

import { ImportButton, PageContainer, ProtectedPageTitle } from '@/components/Elements'
import ImportModal from '@/components/ImportTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useImportEventsCSVMutation } from '@/redux/games/games.api'

import { DEFAULT_IMPORT_MODAL_OPTIONS } from '@/constants/import'

const Events = () => {
  const [fileKey, setFileKey] = useState('')
  const inputRef = useRef<HTMLInputElement | null>()
  const [importEvents] = useImportEventsCSVMutation()
  const [importModalOptions, setImportModalOptions] = useState(DEFAULT_IMPORT_MODAL_OPTIONS)

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

      await importEvents(body)
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

      setFileKey(new Date().toISOString())
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Events</title>
      </Helmet>

      {importModalOptions.isOpen && (
        <ImportModal
          title="Importing"
          filename={importModalOptions.filename}
          status={importModalOptions.status}
          errorMessage={importModalOptions.errorMessage}
          showInList={() => {}}
          redirectToImportInfo={() => {
            setImportModalOptions((prev) => ({ ...prev, isOpen: false }))
          }}
          onClose={() => setImportModalOptions((prev) => ({ ...prev, isOpen: false }))}
          isHideRedirects
        />
      )}

      <BaseLayout>
        <PageContainer>
          <Flex justify="space-between" align="center" vertical={false}>
            <ProtectedPageTitle>Events</ProtectedPageTitle>

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
        </PageContainer>
      </BaseLayout>
    </>
  )
}

export default Events

