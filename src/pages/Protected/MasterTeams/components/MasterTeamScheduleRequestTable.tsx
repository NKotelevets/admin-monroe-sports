// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import styled from '@emotion/styled'
import { Table, Tabs } from 'antd'
import {
  useMasterTeamScheduleRequestTable
} from '@/pages/Protected/MasterTeams/hooks/useMasterTeamScheduleRequestTable.tsx'
import { useLazyGetScheduleRequestQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/Button.tsx'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import {  LinkOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'

interface IMasterTeamScheduleRequestTableProps {
  dates: { start: string, end: string } | null
  selectedIds: string[]
}

export const MasterTeamScheduleRequestTable = (props: IMasterTeamScheduleRequestTableProps) => {
  const { dates, selectedIds } = props
  const { columns, setTableData, data } = useMasterTeamScheduleRequestTable()

  const [listScheduleRequest, { data: scheduleRequests }] = useLazyGetScheduleRequestQuery()
  const [selectedTabIndex, setSelectedTabIndex] = useState(4)

  // Fetches schedule for period and selected master team ids
  useEffect(() => {
    !!dates
    && !!selectedIds
    && listScheduleRequest({ start_date: dates.start, end_date: dates.end, team_ids: selectedIds.join(',') })
  }, [dates, selectedIds])

  // Update table with data from selected master team tab
  useEffect(() => {
    if (!scheduleRequests) return

    const key = Object.keys(scheduleRequests)[selectedTabIndex]
    setTableData(scheduleRequests[key])
  }, [scheduleRequests, selectedTabIndex])

  return (
    <>
      <MasterTeamTabList
        selectedIndex={selectedTabIndex}
        setSelectedIndex={setSelectedTabIndex}
        data={scheduleRequests}
      />
      <TableStyled
        size="small"
        loading={!data}
        virtual={false}
        columns={columns}
        dataSource={data || undefined}
        pagination={false}
        scroll={{
          x: 1200 // Horizontal scroll
        }}
      />
    </>
  )
}

interface IMasterTeamTabListProps {
  data: unknown
  selectedIndex: number

  setSelectedIndex(index: number): void
}

const MasterTeamTabList = (props: IMasterTeamTabListProps) => {
  const { data, selectedIndex, setSelectedIndex } = props

  const renderTabWithIcon = (title: string, url: string) => (
    <CustomTab>
      <TabText className='tab-textx'>{title}</TabText>
      <HoverIcon
        onClick={() => alert('Delete clicked!')}
        className="hover-icon"
        title="Delete this tab"
      >
        <DeleteOutlined />
      </HoverIcon>
      <StaticIcon href={url} target="_blank" rel="noopener noreferrer">
        <LinkOutlined />
      </StaticIcon>
    </CustomTab>
  )

  const tabItems = useMemo(() => (
    data ? Object.keys(data).map((mt, i) => {
      return {
        label: renderTabWithIcon(mt, 'xxx'),
        key: `${i}`,
        disabled: i === 28,
        children: ``
      }
    }) : []
  ), [data])

  if (!data) return <></>

  const tabs = (
    <Tabs
      defaultActiveKey={`tab-${selectedIndex}`}
      tabBarStyle={{ marginBottom: 0 }}
      tabBarExtraContent={<Button icon={<PlusOutlined />}>Add team</Button>}
      items={tabItems}
      onChange={index => setSelectedIndex(parseInt(index))}
    />
  )
  return tabs
  // return Object.keys(data).map((mt: any, index: number) => <div onClick={() => setSelectedIndex(index)}> { mt }</div>)
}

const TableStyled = styled(Table)`
    & .ant-table-thead > tr > th {
        height: 48px; /* Set your desired height */
        border-bottom: 1px solid #BDBCC2;
    }

    & .ant-table-thead th.ant-table-cell {
        padding: 0 !important;
    }

    & .date-column {
        background-color: #F1F0FF;
        border-bottom: 1px solid #CBC7FF !important;
        color: #1A1657D9;
        padding-left: 12px !important;
    }

    & .ant-table-row:hover .date-column {
        background-color: #ece9ff; /* Same as base to prevent override */
    }
`
// Styled Components
const CustomTab = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 200px; /* Adjust to fit your tab width */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;

    &:hover .hover-icon {
        opacity: 1; /* Show hover icon */
    }
    
    &:hover .tab-text {
        max-width: 80%;
    }
`

const TabText = styled.span`
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const StaticIcon = styled.a`
    color: #1890ff; /* Link icon color */
    margin-left: 8px;
    flex-shrink: 0;
`

const HoverIcon = styled.a`
    position: absolute;
    right: 32px; /* Align near the right edge of the text */
    color: #ff4d4f; /* Trash icon color */
    opacity: 0; /* Hidden by default */
    transition: opacity 0.3s ease;
    cursor: pointer;
`
