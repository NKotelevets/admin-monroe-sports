import { ImportButton } from '@/components/ImportButton'
import { useImportEventsCSVMutation } from '@/redux/events/events.api'
import { TDeleteStatus } from '@/common/types'
import { PATH_TO_EVENTS_IMPORT_INFO } from '@/common/constants/paths.ts'

export const EventTableControls = () => {
  const [importEvents] = useImportEventsCSVMutation()

  const onImport = (body: FormData) => {
    return importEvents(body).unwrap()
      .then(response => ({
        status: response.status as TDeleteStatus,
        message: ''
      }))
      .catch(response => {
        return ({
          status: 'red' as TDeleteStatus,
          message: (response?.data as {
            code: string;
            error: string
          })?.error || response.data?.detail || 'Something went wrong. Please, try again'
        })
      })
  }

  return (
    <>
      <ImportButton
        fileName="file"
        infoPath={PATH_TO_EVENTS_IMPORT_INFO}
        onChange={onImport}
      />
    </>
  )
}
