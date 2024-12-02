import styled from '@emotion/styled'
import { Table } from 'antd'
import {
  useMasterTeamScheduleRequestTable
} from '@/pages/Protected/MasterTeams/hooks/useMasterTeamScheduleRequestTable.tsx'
import { useLazyGetScheduleRequestQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { useContext, useEffect } from 'react'
import { TeamTabList } from '@/components/ScheduleRequest/TeamTabList.tsx'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import Loader from '@/components/Loader.tsx'
import { IScheduleEntry } from '@/common/interfaces/masterTeams.ts'

export const MasterTeamScheduleRequestTable = () => {
  const { dates, selectedIds, selectedTabIndex } = useContext(ScheduleContext)
  const { columns, setTableData, data } = useMasterTeamScheduleRequestTable()

  const [listScheduleRequest, { data: scheduleRequests, isLoading, isFetching }] = useLazyGetScheduleRequestQuery()

  // Fetches schedule for period and selected master team ids
  useEffect(() => {
    !!dates
    && !!selectedIds
    && listScheduleRequest({
      start_date: dates.start,
      end_date: dates.end,
      team_ids: selectedIds.join(',')
    })
  }, [dates, selectedIds])

  // Update table with data from selected master team tab
  useEffect(() => {
    if (!scheduleRequests) return

    const key = Object.keys(scheduleRequests)[selectedTabIndex]
    setTableData(scheduleRequests[key])
  }, [scheduleRequests, selectedTabIndex])

  if (!selectedIds || !dates) return <Loader />

  return (
    <>
      <TeamTabList
        data={scheduleRequests}
      />
      <TableStyled
        size="small"
        loading={!data || isLoading || isFetching}
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

// Styled Components
const TableStyled = styled(Table<IScheduleEntry>)`
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
