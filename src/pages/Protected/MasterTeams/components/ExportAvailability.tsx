import { ScheduleOutlined } from '@ant-design/icons'
import Btn from 'antd/es/button/button'
import styled from '@emotion/styled'
import { Dropdown, Flex } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import MonroeButton from '@/components/MonroeButton.tsx'
import DatePickerRange, { IDateRangePickerRef } from '@/components/DatePickerRange.tsx'
import { Dayjs } from 'dayjs'
import { useNotification } from '@/hooks/useNotification.ts'
import { IExportInfoProps } from '@/common/interfaces/masterTeams.ts'
import { useMasterTeamExportCSV } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamExportCSV.ts'

export const ExportAvailability = (props: IExportInfoProps) => {
  const { selectedMasterTeamIds } = props

  const content = useCallback(() => (
    !!selectedMasterTeamIds.length && <DropdownContent masterTeamIds={selectedMasterTeamIds} />
  ), [selectedMasterTeamIds])

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
      <Button icon={<ScheduleOutlined />} iconPosition="start">
        Export Availability
      </Button>
    </Dropdown>
  )
}

const DropdownContent = (props: { masterTeamIds: string[] }) => {
  const { masterTeamIds } = props
  const { onExport, isLoading, status } = useMasterTeamExportCSV()
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
  const onClickExport = () => {
    if (!startDate || !endDate || !masterTeamIds) return
    onExport(
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
      masterTeamIds.join(',')
    )
  }

  return (
    <View
      className="ant-dropdown-menu ant-dropdown-menu-root"
      vertical
    >
      <PickerWrapper>
        <DatePickerRange
          ref={datePickerRef}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </PickerWrapper>
      <Flex>
        <MButton
          label="Reset"
          type="text"
          isDisabled={!isValid || isLoading}
          onClick={datePickerRef?.current?.reset}
        />
        <Spacer />
        <MButton
          label="Export"
          type="primary"
          isLoading={isLoading}
          isDisabled={!isValid}
          onClick={onClickExport}
        />
      </Flex>
    </View>
  )
}

const Button = styled(Btn)`
    margin-right: 8px
`
const MButton = styled(MonroeButton)`
    font-size: 14px
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
