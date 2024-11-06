import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { DatePicker, Flex } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import styled from '@emotion/styled'

interface IDateRangePickerProps {
  onStartChange(value: Dayjs | null): void

  onEndChange(value: Dayjs | null): void
}

export type IDateRangePickerRef = {
  reset(): void
} | undefined

/**
 * DateRangePicker Component
 *
 * This component provides a controlled date range picker with two `DatePicker` inputs
 * to select start and end dates. It ensures that the end date cannot be before the start date
 * and supports resetting both dates via a ref. The start date picker is initialized to today’s date.
 *
 * @component
 * @param {IDateRangePickerProps} props - The props for the component.
 * @param {(date: Dayjs | null) => void} props.onStartChange - Callback function triggered when the start date changes.
 * @param {(date: Dayjs | null) => void} props.onEndChange - Callback function triggered when the end date changes.
 *
 * @param {React.Ref<IDateRangePickerRef>} ref - Forwarded ref to expose the reset functionality.
 *
 * @example
 * <DateRangePicker
 *   onStartChange={(date) => console.log("Start Date:", date)}
 *   onEndChange={(date) => console.log("End Date:", date)}
 *   ref={dateRangePickerRef}
 * />
 *
 * @returns {ReactElement} A date range picker component with separate start and end date inputs.
 */
const DateRangePicker = forwardRef<IDateRangePickerRef, IDateRangePickerProps>((props, ref) => {
  const { onStartChange, onEndChange } = props

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs())
  const [endDate, setEndDate] = useState<Dayjs | null>(null)

  // update startDate for parent
  useEffect(() => {
    onStartChange(startDate)
  }, [startDate])

  // update endDate for parent
  useEffect(() => {
    onEndChange(endDate)
  }, [endDate])

  // pass reset to parent
  useImperativeHandle(ref, () => ({
    reset
  }), [])

  const reset = useCallback(() => {
    setStartDate(null)
    setEndDate(null)
  }, [])

  const handleStartDateChange = useCallback((date: Dayjs | null) => {
    setStartDate(date)
    onStartChange(date)

    if (endDate && date && date.isAfter(endDate)) {
      setEndDate(null)
      onEndChange(null)
    }
  }, [endDate])

  const handleEndDateChange = useCallback((date: Dayjs | null) => {
    setEndDate(date)
  }, [])

  const disabledEndDate = useCallback((current: Dayjs | null) => {
    return !!startDate && !!current && current.isBefore(startDate, 'day')
  }, [startDate])

  return (
    <Flex flex={1}>
      <Flex vertical flex={1}>
        <Label>From</Label>
        <DatePicker
          placeholder="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          format="MMM D YYYY"
        />
      </Flex>
      <Dash />
      <Flex vertical flex={1}>
        <Label>To</Label>
        <DatePicker
          placeholder="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          disabledDate={disabledEndDate}
          format="MMM D YYYY"
        />
      </Flex>
    </Flex>
  )
})

const Dash = styled.div`
    position: relative;
    min-width: 25px;
    &:after {
        content: '-';
        position: absolute;
        bottom: 5px;
        left: calc(50% - 4px);
    }
`
const Label = styled.div`
    margin-bottom: 4px
`

export default DateRangePicker
