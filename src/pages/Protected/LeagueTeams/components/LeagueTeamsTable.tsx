import { MonroeTable } from '@/components/Table/MonroeTable.tsx'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useEffect, useMemo } from 'react'
import { useLeagueTeamTable } from '../hooks/useLeagueTeamTable'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { useNotification } from '@/hooks/useNotification.ts'
// import { ExpandedHeaderLeftText, ExpandedTableHeader, MonroeLightBlueText } from '@/components/Elements'

const ERROR_LOADING_LEAGUE_TEAMS_MESSAGE = `Could not load league teams. Please, try again!`

interface ILeagueTeamsTableProps {
  selectedIds: string[]

  setSelectedIds(ids: string[]): void

  setSingleDeleting(value: boolean): void
}

export const LeagueTeamsTable = (props: ILeagueTeamsTableProps) => {
  const { selectedIds, setSelectedIds, setSingleDeleting } = props
  const { columns } = useLeagueTeamTable({ setSelectedIds, setSingleDeleting })
  const { notify } = useNotification()
  const {
    leagueTeams, offset,
    limit,
    ordering,
    total,
    setPaginationParams
  } = useLeagueTeamsSlice()

  const [listLeagueTeam] = useLazyGetLeagueTeamsQuery()
  // const [showAdditionalHeader, setShowAdditionalHeader] = useState(false)

  useEffect(() => {
    setPaginationParams({ offset, limit, ordering })
    listLeagueTeam({
      limit,
      offset,
      ordering: ordering || undefined
    })
      .catch(() => notify(ERROR_LOADING_LEAGUE_TEAMS_MESSAGE, 'error'))
  }, [])

  const pagination = useMemo(() => ({
    offset, ordering, limit, total
  }), [offset, ordering, limit, total])

  const handleTableChange = () => {
    setSelectedIds([])
  }

  return (
    <>
      {/*{showAdditionalHeader && (*/}
      {/*  <ExpandedTableHeader>*/}
      {/*    <ExpandedHeaderLeftText>*/}
      {/*      {isDeleteAllRecords*/}
      {/*        ? `All ${total} master teams are selected.`*/}
      {/*        : `All ${limit} master teams on this page are selected.`}*/}
      {/*    </ExpandedHeaderLeftText>*/}

      {/*    {!isDeleteAllRecords ? (*/}
      {/*      <MonroeLightBlueText onClick={() => setIsDeleteAllRecords(true)}>*/}
      {/*        Select all {total} master teams instead.*/}
      {/*      </MonroeLightBlueText>*/}
      {/*    ) : (*/}
      {/*      <MonroeLightBlueText*/}
      {/*        onClick={() => {*/}
      {/*          setSelectedIds([])*/}
      {/*          setShowAdditionalHeader(false)*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Unselect all league teams*/}
      {/*      </MonroeLightBlueText>*/}
      {/*    )}*/}
      {/*  </ExpandedTableHeader>*/}
      {/*)}*/}
      <MonroeTable<IFELeagueTeam>
        columns={columns}
        dataSource={leagueTeams}
        onChange={handleTableChange} // FIXME
        pagination={pagination}
        showCreated={false}
        createdIds={[]}
        loading={false}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (selected) => {
            // if (selected.length === limit) setShowAdditionalHeader(true)
            // if (selected.length < limit) setShowAdditionalHeader(false)
            setSelectedIds(selected as string[])
          },
        }}
      />
    </>
  )
}
