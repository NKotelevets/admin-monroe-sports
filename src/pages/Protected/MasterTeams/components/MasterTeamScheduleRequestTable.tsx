import { ReactElement, useContext, useEffect, useMemo } from 'react'

import { AddMasterTeamDropdown } from '@/pages/Protected/MasterTeams/components/AddMasterTeamDropdown.tsx'

import Loader from '@/components/Loader.tsx'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { TableStyled } from '@/components/ScheduleRequest/TableStyled'
import { TeamTabList } from '@/components/ScheduleRequest/TeamTabList.tsx'

import { useLazyGetScheduleRequestQuery } from '@/redux/masterTeams/masterTeams.api.ts'

import { useScheduleRequestTable } from '@/hooks/useScheduleRequestTable.tsx'

/**
 * Component that represents the master schedule request table for a team.
 *
 * Fetches and displays scheduling data based on selected dates and team IDs.
 * Utilizes data from the `ScheduleContext` and dynamically updates
 * the table when schedule request data or selected tab index changes.
 *
 * Dependencies include fetching scheduling data using `useLazyGetScheduleRequestQuery`,
 * and managing table columns and data through `useScheduleRequestTable`.
 *
 * @component
 * @returns {ReactElement} The rendered schedule request table component.
 */
export const MasterTeamScheduleRequestTable = (): ReactElement => {
  const { dates, selectedIds, selectedTabIndex } = useContext(ScheduleContext)
  const { columns, setTableData, data } = useScheduleRequestTable()

  const [listScheduleRequest, { data: scheduleRequests, isLoading, isFetching }] = useLazyGetScheduleRequestQuery()

  /**
   * Executes a schedule request if both `dates` and `selectedIds` are defined.
   * Constructs the request payload using the provided start and end dates,
   * and compiles the selected team IDs into a comma-separated string.
   *
   * @function
   * @param {Object} dates - Object containing start and end dates.
   * @param {Date} dates.start - The start date of the schedule range.
   * @param {Date} dates.end - The end date of the schedule range.
   * @param {Array<string>} selectedIds - Array of team IDs to include in the schedule request.
   * @param {Function} listScheduleRequest - Function to execute the schedule request with the constructed payload.
   */
  useEffect(() => {
    !!dates &&
      !!selectedIds &&
      listScheduleRequest({
        start_date: dates.start,
        end_date: dates.end,
        team_ids: selectedIds.join(','),
      })
  }, [dates, selectedIds])

  useEffect(() => {
    if (!scheduleRequests) return

    setTableData(scheduleRequests[selectedTabIndex])
  }, [scheduleRequests, selectedTabIndex])

  const extraContent = useMemo(() => <AddMasterTeamDropdown />, [])

  if (!selectedIds || !dates) return <Loader />

  return (
    <>
      <TeamTabList data={scheduleRequests || []} extraContent={extraContent} />
      <TableStyled
        size="small"
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
