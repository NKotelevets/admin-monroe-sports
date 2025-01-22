import { useTableContext } from '@/hooks/useTableContext.ts'
import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'
import { Button } from 'antd'
import { PATH_TO_BULK_EDIT_EVENT } from '@/common/constants/paths.ts'
import { useEffect } from 'react'

export const EventBulkEditButton = () => {
  const { selectedIds } = useTableContext()
  const { setSelectedRecordIds } = useEventsSlice()

  useEffect(() => {
    setSelectedRecordIds(selectedIds)
  }, [selectedIds])

  if (selectedIds.length < 2)
    return <></>

  return <Button href={PATH_TO_BULK_EDIT_EVENT}>Bulk Edit</Button>
}
