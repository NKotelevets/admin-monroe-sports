import { useNavigate } from 'react-router-dom'
import { TRangePickerValue } from '@/common/types'
import dayjs, { Dayjs } from 'dayjs'
import { Col, DatePicker, Row } from 'antd'
import { Button } from '@/components/Button.tsx'
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined'
import React, { useContext } from 'react'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'

const { RangePicker } = DatePicker

const DATE_FORMAT = 'YYYY-MM-DD'

interface IScheduleRequestControlsProps {
  pathToNavigate: string
}

export const ScheduleRequestControls = React.memo((props: IScheduleRequestControlsProps) => {
  const { pathToNavigate } = props
  const { dates, selectedIds } = useContext(ScheduleContext)

  const navigate = useNavigate()
  const pickerValue: TRangePickerValue = [dayjs(dates?.start, DATE_FORMAT), dayjs(dates?.end, DATE_FORMAT)]

  const onDateRangeChange = (newDates: [Dayjs | null, Dayjs | null] | null) => {
    if (newDates && newDates.length > 0) {
      navigate(`${pathToNavigate}/${dayjs(newDates[0]).format('YYYY-MM-DD')},${dayjs(newDates[1]).format('YYYY-MM-DD')}/${selectedIds}`)
    }
  }

  return (
    <Row gutter={8}>
      <Col>
        <RangePicker
          format="D MMM YYYY"
          defaultValue={pickerValue}
          value={pickerValue}
          onChange={onDateRangeChange}
        />
      </Col>
      <Col>
        <Button icon={<UploadOutlined />}>
          Export current schedule request
        </Button>
      </Col>
      <Col>
        <Button type="primary" icon={<UploadOutlined />}>
          Export all schedule request
        </Button>
      </Col>
    </Row>
  )
}, (prev, next) => (
  prev.pathToNavigate === next.pathToNavigate
))
