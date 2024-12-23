import { TRangePickerValue } from '@/common/types'
import dayjs, { Dayjs } from 'dayjs'
import { Col, DatePicker, Row } from 'antd'
import { Button } from '@/components/Button.tsx'
import UploadOutlined from '@ant-design/icons/lib/icons/UploadOutlined'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { IDownloadStatus } from '@/common/interfaces'
import { IUseMasterTeamExportCSVReturn } from '@/hooks/useExportScheduleCSV.ts'

const { RangePicker } = DatePicker

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_EXPORT_ERROR_MESSAGE = 'Unable to export CSV. Please, try again!'

interface IScheduleRequestControlsProps {
  status: IDownloadStatus | null
  isLoading: boolean

  onExport: IUseMasterTeamExportCSVReturn['onExport']
}

/**
 * The `ScheduleRequestControls` component provides UI controls for selecting a date range
 * and exporting schedule data for the current or all schedule requests. It includes:
 * - A date range picker to select start and end dates.
 * - Buttons to export the schedule for the current selected team or for all teams.
 * - Loading and error handling during the export process.
 *
 * It uses the `ScheduleContext` to get and update the schedule data and the `useMasterTeamExportCSV`
 * hook to handle the CSV export functionality.
 *
 * @returns {ReactElement} The rendered schedule controls with date picker and export buttons.
 */
export const ScheduleRequestControls = (props: IScheduleRequestControlsProps): ReactElement => {
  const { onExport, status, isLoading } = props
  const {
    dates,
    pathToExport,
    selectedTabIndex,
    navigateWithData,
    additionalData
  } = useContext(ScheduleContext)

  const { notify } = useNotification()

  const [exporting, setExporting] = useState<'single' | 'all' | null>(null)
  const pickerValue: TRangePickerValue = [dayjs(dates?.start, DATE_FORMAT), dayjs(dates?.end, DATE_FORMAT)]

  /**
   * Catches error messages for failed export.
   * If export fails, it triggers a notification with the error message.
   */
  useEffect(() => {
    if (!status) return

    // Notify user of the export status or show the default error message.
    notify(status.message || DEFAULT_EXPORT_ERROR_MESSAGE, status.type)
  }, [status])

  /**
   * Updates the URL and state when the date range is changed by the user.
   *
   * @param newDates The new date range selected by the user.
   * It is an array with two `Dayjs` objects or `null` values.
   */
  const onDateRangeChange = (newDates: [Dayjs | null, Dayjs | null] | null) => {
    if (newDates && newDates.length > 0) {
      navigateWithData(undefined, dayjs(newDates[0]).format('YYYY-MM-DD'), dayjs(newDates[1]).format('YYYY-MM-DD'))
    }
  }

  /**
   * Initiates the export of the schedule for the current selected team.
   */
  const onExportSingle = () => {
    setExporting('single')
    if (additionalData) {
      onExport(dates!.start, dates!.end, additionalData[selectedTabIndex].id, pathToExport)
    }
  }

  /**
   * Initiates the export of the schedule for all selected teams.
   */
  const onExportAll = () => {
    setExporting('all')
    if (additionalData) {
      const ids = additionalData.map(dt => dt.id)
      onExport(dates!.start, dates!.end, ids.join(','), pathToExport)
    }
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
