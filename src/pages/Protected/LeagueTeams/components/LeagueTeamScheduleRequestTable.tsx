import { useContext, useEffect } from 'react'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { useScheduleRequestTable } from '@/hooks/useScheduleRequestTable.tsx'
import { useLazyGetLeagueTeamScheduleRequestQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import Loader from '@/components/Loader.tsx'
import { TeamTabList } from '@/components/ScheduleRequest/TeamTabList.tsx'
import { TableStyled } from '@/components/ScheduleRequest/TableStyled.tsx'
import { AddLeagueTeamDropdown } from '@/pages/Protected/LeagueTeams/components/AddLeagueTeamDropdown.tsx'

export const LeagueTeamScheduleRequestTable = () => {
  const { dates, selectedIds, selectedTabIndex } = useContext(ScheduleContext)
  const { columns, setTableData, data } = useScheduleRequestTable()

  const [
    listScheduleRequest,
    { data: scheduleRequests, isLoading, isFetching }
  ] = useLazyGetLeagueTeamScheduleRequestQuery()

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
        extraContent={<AddLeagueTeamDropdown />}
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
