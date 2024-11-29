// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import styled from '@emotion/styled'
import { Table, Tabs, Tooltip } from 'antd'
import {
  useMasterTeamScheduleRequestTable
} from '@/pages/Protected/MasterTeams/hooks/useMasterTeamScheduleRequestTable.tsx'
import { useLazyGetScheduleRequestQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/Button.tsx'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import {  LinkOutlined } from '@ant-design/icons'
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined'
import { colors } from '@/utils/colors.tsx'

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

  const renderTabWithIcon = (title: string, index: number, url: string) => (
    <CustomTab className={`${index === selectedIndex ? 'selected-tab' : ''}`}>
      <TabText className='tab-text'>{title}</TabText>
      <Tooltip title='Remove team from the list'>
        <HoverIcon
          onClick={() => alert('Delete clicked!')}
          className="hover-icon"
          title="Delete this tab"
        >
          <DeleteOutlined />
        </HoverIcon>
      </Tooltip>
      <Tooltip title='Go to team info page'>
        <StaticIcon href={url} target="_blank" rel="noopener noreferrer">
          <LinkOutlined />
        </StaticIcon>
      </Tooltip>
    </CustomTab>
  )

  const tabItems = useMemo(() => (
    data ? Object.keys(data).map((mt, i) => {
      return {
        label: renderTabWithIcon(mt, i,'xxx'),
        key: `${i}`,
        children: ``
      }
    }) : []
  ), [data])

  if (!data) return <></>

  return (
    <Tabs
      defaultActiveKey={`tab-${selectedIndex}`}
      tabBarStyle={{ marginBottom: 0 }}
      tabBarExtraContent={<Button icon={<PlusOutlined />}>Add team</Button>}
      items={tabItems}
      onChange={index => setSelectedIndex(parseInt(index))}
    />
  )
}

// Styled Components
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
const CustomTab = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    max-width: 200px; /* Adjust to fit your tab width */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;

    .ant-tabs-tab-active &:hover .hover-icon {
        display: inline-block;
    }

    .ant-tabs-tab-active &:hover .tab-text {
        max-width: calc(80% - 24px);
        overflow: hidden;
    }
`

const TabText = styled.span`
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const StaticIcon = styled.a`
    color: ${colors.secondaryText}; /* Link icon color */
    margin-left: 8px;
    flex-shrink: 0;
`

const HoverIcon = styled.a`
    position: absolute;
    right: 18px;
    color: ${colors.primary};
    display: none;
    cursor: pointer;
    &:hover {
        color: ${colors.primary}
    }
`
