import { ReactElement, useContext, useEffect, useMemo } from 'react'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { useScheduleRequestTable } from '@/hooks/useScheduleRequestTable.tsx'
import { useLazyGetLeagueTeamScheduleRequestQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import Loader from '@/components/Loader.tsx'
import { TeamTabList } from '@/components/ScheduleRequest/TeamTabList.tsx'
import { TableStyled } from '@/components/ScheduleRequest/TableStyled.tsx'
import { AddLeagueTeamDropdown } from '@/pages/Protected/LeagueTeams/components/AddLeagueTeamDropdown.tsx'
import { PATH_TO_LEAGUE_TEAMS } from '@/common/constants/paths.ts'

/**
 * Renders the League Team Schedule Request Table component.
 *
 * This component fetches and displays schedule requests for selected
 * master team ids and a defined period. It includes interactive
 * functionalities such as tab-based data selection, loading indicators,
 * and dropdown content for additional actions.
 *
 * @return {ReactElement} The League Team Schedule Request Table component, including a tab list, loading state, and a responsive data table.
 */
export const LeagueTeamScheduleRequestTable = (): ReactElement => {
  const { dates, selectedIds, selectedTabIndex } = useContext(ScheduleContext)
  const { columns, setTableData, data } = useScheduleRequestTable()

  const [
    listScheduleRequest,
    { data: scheduleRequests, isLoading, isFetching }
  ] = useLazyGetLeagueTeamScheduleRequestQuery()

  /**
   * Executes a schedule request if the required parameters are provided.
   *
   * Checks if `dates` and `selectedIds` are truthy. If both are valid,
   * it triggers the `listScheduleRequest` function with the specified
   * start date, end date, and a comma-separated list of team IDs.
   *
   * @function
   */
  useEffect(() => {
    !!dates
    && !!selectedIds
    && listScheduleRequest({
      start_date: dates.start,
      end_date: dates.end,
      team_ids: selectedIds.join(',')
    })
  }, [dates, selectedIds])

  /**
   * Updates table data based on the selected tab index if scheduleRequests is defined.
   */
  useEffect(() => {
    if (!scheduleRequests) return

    setTableData(scheduleRequests[selectedTabIndex])
  }, [scheduleRequests, selectedTabIndex])

  /**
   * Functional component that renders a dropdown for adding a league team.
   * Typically used in a sports management or league management context.
   *
   * @function
   * @returns {ReactElement} Dropdown component for adding a league team.
   */
  const extraContent = useMemo(() => <AddLeagueTeamDropdown />, [])

  if (!selectedIds || !dates) return <Loader />

  return (
    <>
      <TeamTabList
        pathToNavigate={PATH_TO_LEAGUE_TEAMS}
        data={scheduleRequests || []}
        extraContent={extraContent}
      />
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
