import dayjs from 'dayjs'
import Flex from 'antd/es/flex'
import { DatePicker } from 'antd'
import styled from '@emotion/styled'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useCallback } from 'react'
import { Button } from '../Button'

const { RangePicker } = DatePicker

export const DateRangeFilterDropdown = (props: FilterDropdownProps) => {
  const { selectedKeys, close, setSelectedKeys, confirm, clearFilters } = props

  const currentRange = selectedKeys.length ? selectedKeys : []

  const onConfirm = useCallback(() => confirm(), [])

  const onClean = useCallback(() => {
    setSelectedKeys([])

    !!clearFilters && clearFilters()
    confirm()
    close()
  }, [setSelectedKeys])

  return (
    <>
      <Wrapper align="center" justify="space-between">
        <RangePickerStyled
          format='MMM D YYYY'
          onChange={(dates) => {
            if (dates) {
              setSelectedKeys(dates.map(date => date?.format('YYYY-MM-DD') || ''))
            } else {
              setSelectedKeys([])
            }
          }}
          value={
            currentRange.length === 2
              ? [dayjs(currentRange[0] as string, 'YYYY-MM-DD'), dayjs(currentRange[1] as string, 'YYYY-MM-DD')]
              : undefined
          }
        />
      </Wrapper>
      <ActionButtons align="center" justify="space-between">
        <Button
          disabled={currentRange.length === 0}
          size="small"
          type='link'
          onClick={onClean}
        >
          Reset Filter
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={onConfirm}
        >
          Apply
        </Button>
      </ActionButtons>
    </>
  )
}

// Styled Components
const RangePickerStyled = styled(RangePicker)`
    max-width: 248px;

    & .ant-picker-body {
        padding: 8px !important;
        margin-top: 8px;
    }

    & .ant-picker-calendar-header {
        justify-content: center;
    }
`
const Wrapper = styled(Flex)`
    padding: 8px 8px 8px;
`
const ActionButtons = styled(Flex)`
    padding: 0 8px 8px;
`
