import styled from '@emotion/styled'
import { Dropdown, Flex } from 'antd'
import { ScheduleOutlined } from '@ant-design/icons'
import { useNotification } from '@/hooks/useNotification.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import DatePickerRange, { IDateRangePickerRef } from '@/components/DatePickerRange.tsx'
import dayjs, { Dayjs } from 'dayjs'
import { Button } from '@/components/Button.tsx'
import { useNavigate } from 'react-router-dom'
import { IExportInfoProps } from '@/common/interfaces'
import { useTableContext } from '@/hooks/useTableContext.ts'

export const ScheduleRequestButton = (props: Omit<IExportInfoProps, 'teamIds'>) => {
  const { ...rest } = props
  const { selectedIds: teamIds, singleDeleting } = useTableContext()

  const content = () => (
    <DropdownContent
      teamIds={teamIds}
      {...rest}
    />
  )

  /**
   * At least one Master Team needs to be selected to show this component.
   * If user is deleting, the button is not shown.
   */
  if (!teamIds.length || singleDeleting) {
    return <></>
  }

  return (
    <Dropdown
      dropdownRender={content}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="dropdown"
    >
      <Button icon={<ScheduleOutlined />} iconPosition="start">
        Schedule Request
      </Button>
    </Dropdown>
  )
}

const DropdownContent = (props: IExportInfoProps) => {
  const {
    teamIds,
    onExport,
    pathToSchedule,
    pathToExport,
    exportFileName,
    exportFileExtension
  } = props
  const { notify } = useNotification()

  const navigate = useNavigate()
  const datePickerRef = useRef<IDateRangePickerRef>()

  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [isValid, setIsValid] = useState<boolean>(false)

  useEffect(() => {
    setIsValid(!!startDate && !!endDate)
  }, [startDate, endDate])

  /**
   * notifies user when something went wrong
   */
  useEffect(() => {
    !!onExport.status && (
      notify(onExport.status.message, onExport.status.type)
    )
  }, [onExport.status])

  /**
   * Downloads the file
   */
  const onExportAvailability = useCallback(() => {
    if (!startDate || !endDate || !teamIds) return
    onExport.call(
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
      teamIds.join(','),
      pathToExport,
      exportFileName,
      exportFileExtension
    )
  }, [startDate, endDate, teamIds])

  const onShowAvailability = () => {
    if (!startDate || !endDate || !teamIds) return
    navigate(`${pathToSchedule}/${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}/${teamIds.join(',')}`)
  }

  return (
    <View
      className="ant-dropdown-menu ant-dropdown-menu-root"
      vertical
    >
      <PickerWrapper>
        <DatePickerRange
          ref={datePickerRef}
          initialEndDate={dayjs().add(1, 'month')}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </PickerWrapper>
      <Flex>
        <Button
          type="text"
          disabled={!isValid || onExport.isLoading}
          onClick={datePickerRef?.current?.reset}
        >
          Reset
        </Button>
        <Spacer />
        <Button
          type="default"
          loading={onExport.isLoading}
          disabled={!isValid || onExport.isLoading}
          onClick={onExportAvailability}
        >
          Export CSV
        </Button>
        <Spacer />
        <Button
          type="primary"
          disabled={!isValid}
          onClick={onShowAvailability}
        >
          Show in app
        </Button>
      </Flex>
    </View>
  )
}

// Styled Components
const View = styled(Flex)`
    margin-top: 0 !important;
    padding: 8px !important;
    width: 340px
`
const Spacer = styled.div`
    min-width: 8px
`
const PickerWrapper = styled(Flex)`
    padding: 5px 10px 20px
`
