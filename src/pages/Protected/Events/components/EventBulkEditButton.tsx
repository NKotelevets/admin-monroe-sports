import { Button } from 'antd'
import { useEffect } from 'react'

import { useEventsSlice } from '@/redux/hooks/useEventsSlice.ts'

import { useTableContext } from '@/hooks/useTableContext.ts'

import { PATH_TO_BULK_EDIT_EVENT } from '@/common/constants/paths.ts'
import { useNavigate } from 'react-router-dom'
import EditOutlined from '@ant-design/icons/lib/icons/EditOutlined'

export const EventBulkEditButton = () => {
  const { selectedIds } = useTableContext()
  const { setSelectedRecordIds } = useEventsSlice()
  const navigate = useNavigate()

  useEffect(() => {
    setSelectedRecordIds(selectedIds)
  }, [selectedIds])

  if (selectedIds.length < 2) return <></>

  return <Button icon={<EditOutlined/>} onClick={() => navigate(PATH_TO_BULK_EDIT_EVENT)}>Bulk Edit</Button>
}
