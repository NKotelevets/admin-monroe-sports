import dayjs, { Dayjs } from 'dayjs'
import Flex from 'antd/es/flex'
import { Button, Calendar } from 'antd'
import styled from '@emotion/styled'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useCallback } from 'react'

export const DateFilterDropdown = (props: FilterDropdownProps) => {
  const { selectedKeys, close, setSelectedKeys, confirm, clearFilters } = props

  const currentDate = selectedKeys[0]

  const onSelect = useCallback((date: Dayjs) => {
    setSelectedKeys([date.format('YYYY-MM-DD')])
  }, [])

  const onConfirm = useCallback(() => confirm(), [])

  const onClean = useCallback(() => {
    setSelectedKeys([])

    !!clearFilters && clearFilters()
    confirm()
    close()
  }, [setSelectedKeys])

  return (
    <>
      <CalendarStyled
        fullscreen={false}
        onChange={onSelect}
        defaultValue={'' as unknown as Dayjs}
        value={currentDate ? dayjs(currentDate as string, 'YYYY-MM-DD') : undefined}
      />
      <ActionButtons align="center" justify="space-between">
        <Button
          disabled={!currentDate}
          size="small"
          type="text"
          onClick={onClean}
        >
          Clean
        </Button>
        <Button
          disabled={!currentDate}
          size="small"
          type="primary"
          onClick={onConfirm}
        >
          OK
        </Button>
      </ActionButtons>
    </>
  )
}

// Styled Components
const CalendarStyled = styled(Calendar)`
    max-width: 300px;
    width: 300px;

    & .ant-picker-body {
        padding: 8px !important;
        margin-top: 8px;
    }

    & .ant-picker-calendar-header {
        justify-content: center;
    }
`
const ActionButtons = styled(Flex)`
    padding: 0 8px 8px
`
