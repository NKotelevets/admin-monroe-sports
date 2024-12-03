import { useNavigate } from 'react-router-dom'
import { TRangePickerValue } from '@/common/types'
import dayjs, { Dayjs } from 'dayjs'
import { Col, DatePicker, Row } from 'antd'
import { Button } from '@/components/Button.tsx'
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined'
import { useContext, useEffect, useState } from 'react'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { useMasterTeamExportCSV } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamExportCSV.ts'
import { useNotification } from '@/hooks/useNotification.ts'

const { RangePicker } = DatePicker

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_EXPORT_ERROR_MESSAGE = 'Unable to export CSV. Please, try again!'

export const ScheduleRequestControls = () => {
  const {
    dates,
    selectedIds,
    pathToNavigate,
    selectedTabIndex
  } = useContext(ScheduleContext)

  const { onExport, status, isLoading } = useMasterTeamExportCSV()
  const { notify } = useNotification()

  const [exporting, setExporting] = useState<'single' | 'all' | null>(null)

  const navigate = useNavigate()
  const pickerValue: TRangePickerValue = [dayjs(dates?.start, DATE_FORMAT), dayjs(dates?.end, DATE_FORMAT)]

  /**
   * Catches error messages for failed export
   */
  useEffect(() => {
    if (!status) return

    notify(status.message || DEFAULT_EXPORT_ERROR_MESSAGE, status.type)
  }, [status])

  /**
   * Updates url and state on date change
   * @param newDates
   */
  const onDateRangeChange = (newDates: [Dayjs | null, Dayjs | null] | null) => {
    if (newDates && newDates.length > 0) {
      navigate(`${pathToNavigate}/${dayjs(newDates[0]).format('YYYY-MM-DD')},${dayjs(newDates[1]).format('YYYY-MM-DD')}/${selectedIds}`)
    }
  }

  /**
   * Export current master team
   */
  const onExportSingle = () => {
    setExporting('single')
    !!selectedIds && onExport(dates!.start, dates!.end, selectedIds[selectedTabIndex])
  }

  /**
   * Export all master teams
   */
  const onExportAll = () => {
    setExporting('all')
    !!selectedIds && onExport(dates!.start, dates!.end, selectedIds.join(','))
  }

  return (
    <Row gutter={8}>
      <Col>
        <RangePicker
          format="D MMM YYYY"
          disabled={isLoading}
          defaultValue={pickerValue}
          value={pickerValue}
          onChange={onDateRangeChange}
        />
      </Col>
      <Col>
        <Button
          disabled={isLoading}
          onClick={onExportSingle}
          icon={<UploadOutlined />}
          loading={isLoading && exporting === 'single'}
        >
          Export current schedule request
        </Button>
      </Col>
      <Col>
        <Button
          type="primary"
          spinnerColor="white"
          disabled={isLoading}
          onClick={onExportAll}
          icon={<UploadOutlined />}
          loading={isLoading && exporting === 'all'}
        >
          Export all schedule request
        </Button>
      </Col>
    </Row>
  )
}
