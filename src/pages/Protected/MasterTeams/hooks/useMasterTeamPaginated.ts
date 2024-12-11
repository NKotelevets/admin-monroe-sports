import { useCallback, useEffect, useRef, useState } from 'react'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'

export const useMasterTeamPaginated = () => {
  const firstLoad = useRef(true)

  const {
    setPaginationParams,
    offset,
    limit
  } = useMasterTeamsSlice()

  const [masterTeamList, { isLoading, isFetching, data }] = useLazyGetMasterTeamsQuery()
  const [masterTeamItems, setMasterTeamItems] = useState<IFEMasterTeam[]>([])

  // fetches first batch of master teams
  useEffect(() => {
    if (firstLoad.current) {
      setMasterTeamItems([])
      masterTeamList({ limit: 10, offset: 0, ordering: undefined })
      firstLoad.current = false
    }
  }, [])

  // updates local master team list
  useEffect(() => {
    if (!data?.results) return
    setMasterTeamItems(mt => ([...mt, ...data.results]))
  }, [data])

  /**
   * Adds a single Master Team to the list.
   * Useful for fetching a single master team externally and adding to the list.
   * @param item
   */
  const addItem = useCallback((item: IFEMasterTeam) => {
    setMasterTeamItems(list => [...list, item])
  }, [])

  const loadMore = useCallback(() => {
    const leagueTeamsRequestParams: IGetLeagueTeamsRequest = {
      offset: offset + 10,
      limit
    }

    masterTeamList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      ordering: null
    })
  }, [limit, offset])

  return {
    masterTeamItems,
    isLoading,
    isFetching,
    loadedData: data,
    loadMore,
    addItem
  }

}
