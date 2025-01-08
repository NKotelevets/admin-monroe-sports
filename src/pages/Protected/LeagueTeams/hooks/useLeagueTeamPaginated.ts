import { useCallback, useEffect, useRef, useState } from 'react'
import { IFELeagueTeam, IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useLazyGetLeagueTeamQuery, useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api'

type TLeagueTeamsPaginatedParams = {
  seasonId?: string
}
export const useLeagueTeamPaginated = (props: TLeagueTeamsPaginatedParams) => {
  const { seasonId } = props

  const firstLoad = useRef(true)

  const {
    setPaginationParams,
    offset,
    limit,
    total
  } = useLeagueTeamsSlice()

  const [leagueTeamList, { isLoading, isFetching, data }] = useLazyGetLeagueTeamsQuery()
  const [getLeagueTeam, singleData] = useLazyGetLeagueTeamQuery()
  const [leagueTeamItems, setLeagueTeamItems] = useState<IFELeagueTeam[]>([])

  // fetches first batch of league teams
  useEffect(() => {
    const filter = { season: seasonId }
    const params = { limit: 10, offset: 0, ...filter }


    setPaginationParams(params)
    setLeagueTeamItems([])
    leagueTeamList(params)
    firstLoad.current = false
  }, [seasonId])


  // updates local league team list
  useEffect(() => {
    if (!data?.results) return
    setLeagueTeamItems(mt => ([...mt, ...data.results]))
  }, [data])

  /**
   * Adds a single League Team to the list.
   * Useful for fetching a single league team externally and adding to the list.
   * @param item
   */
  const addItem = useCallback((item: IFELeagueTeam) => {
    setLeagueTeamItems(list => [...list, item])
  }, [])


  const loadMore = useCallback(() => {
    if (leagueTeamItems.length >= total) return

    const leagueTeamsRequestParams: IGetLeagueTeamsRequest = {
      offset: offset + 10,
      limit
    }

    leagueTeamList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      ordering: null
    })
  }, [limit, offset, leagueTeamItems, total])

  return {
    leagueTeamItems,
    isLoading,
    isFetching,
    loadedData: data,
    loadMore,
    addItem,
    getLeagueTeam,
    singleData
  }

}
