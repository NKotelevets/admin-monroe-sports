import { IExportInfoProps } from '@/common/interfaces/masterTeams.ts'
import styled from '@emotion/styled'
import Btn from 'antd/es/button/button'
import { Dropdown, Flex } from 'antd'
import { ScheduleOutlined } from '@ant-design/icons'
import { useDownloadFile } from '@/hooks/useDownloadFile.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import { useCallback, useEffect, useRef, useState } from 'react'
import DatePickerRange, { IDateRangePickerRef } from '@/components/DatePickerRange.tsx'
import dayjs, { Dayjs } from 'dayjs'
import { transformKeysToSnakeCase } from '@/utils'
import { Button } from '@/components/Button'

export const ScheduleRequestButton = (props: IExportInfoProps) => {
  const { selectedMasterTeamIds } = props

  const content = () => <DropdownContent masterTeamIds={selectedMasterTeamIds} />

  // At least one Master Team needs to be selected
  // to show this component
  if (!selectedMasterTeamIds.length) {
    return <></>
  }

  return (
    <Dropdown
      dropdownRender={content}
      trigger={['click']}
      placement="bottomRight"
      overlayClassName="dropdown"
    >
      <MButton icon={<ScheduleOutlined />} iconPosition="start">
        Schedule Request
      </MButton>
    </Dropdown>
  )
}

const DropdownContent = (props: { masterTeamIds: string[] }) => {
  const { masterTeamIds } = props
  const { download, isLoading, status } = useDownloadFile()
  const { notify } = useNotification()

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
    !!status && (
      notify(status.message, status.type)
    )
  }, [status])

  /**
   * Downloads the file
   */
  const onExportAvailability = useCallback(() => {
    if (!startDate || !endDate || !masterTeamIds) return
    const params = transformKeysToSnakeCase({
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      teamIds: masterTeamIds.join(',')
    }) as Record<string, string>

    download(
      `availability/export?${new URLSearchParams(params).toString()}`,
      'master_team_availability',
      'xlsx'
    )
  }, [startDate, endDate, masterTeamIds])

  const onShowAvailability = alert

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
          disabled={!isValid || isLoading}
          onClick={datePickerRef?.current?.reset}
        >
          Reset
        </Button>
        <Spacer />
        <Button
          type="default"
          loading={isLoading}
          disabled={!isValid || isLoading}
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

const MButton = styled(Btn)`
    margin-right: 8px
`
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
