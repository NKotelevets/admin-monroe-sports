import styled from '@emotion/styled'
import { Table } from 'antd'
import {
  useMasterTeamScheduleRequestTable
} from '@/pages/Protected/MasterTeams/hooks/useMasterTeamScheduleRequestTable.tsx'
import { useLazyGetScheduleRequestQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { ReactElement, useContext, useEffect } from 'react'
import { TeamTabList } from '@/components/ScheduleRequest/TeamTabList.tsx'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import Loader from '@/components/Loader.tsx'
import { IScheduleEntry } from '@/common/interfaces/masterTeams.ts'
import { AddMasterTeamDropdown } from '@/pages/Protected/MasterTeams/components/AddMasterTeamDropdown.tsx'

/**
 * `MasterTeamScheduleRequestTable` is a component that renders a table displaying the schedule requests for
 * selected master teams within a specified date range.
 *
 * It fetches data from an API based on the selected team IDs and date range, and updates the table whenever
 * the selected tab or data changes.
 *
 * The component includes:
 * - A `TeamTabList` for displaying the tabs of selected master teams.
 * - A `Loader` component that is displayed while data is being fetched or loaded.
 * - A `Table` from Ant Design to display the schedule data in a structured format.
 *
 * @component
 *
 * @returns {ReactElement} The rendered `MasterTeamScheduleRequestTable` component.
 *
 * @example
 * ```tsx
 * <MasterTeamScheduleRequestTable />
 * ```
 */
export const MasterTeamScheduleRequestTable = (): ReactElement => {
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

    setTableData(scheduleRequests[selectedTabIndex])
  }, [scheduleRequests, selectedTabIndex])

  if (!selectedIds || !dates) return <Loader />

  return (
    <>
      <TeamTabList
        data={scheduleRequests || []}
        extraContent={<AddMasterTeamDropdown />}
      />
      <TableStyled
        size="small"
        // tableLayout='fixed'
        rowKey={(record) => record.time}
        loading={!data || isLoading || isFetching}
        virtual={false}
        columns={columns}
        dataSource={data || undefined}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </>
  )
}

// Styled Components
const TableStyled = styled(Table<IScheduleEntry>)`
    table-layout: fixed;
    & colgroup col:first-child {
        display: table-column; /* Hides the colgroup */
        
        max-width: 45px !important;
        min-width: 45px !important;
    }
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
        width: 172px;
    }
    & .ant-table-row:hover .date-column {
        background-color: #ece9ff; /* Same as base to prevent override */
    }
`
