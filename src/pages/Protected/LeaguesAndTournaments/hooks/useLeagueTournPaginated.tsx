import { useCallback, useEffect, useRef, useState } from 'react'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice.ts'
import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api.ts'
import { IFELeague } from '@/common/interfaces/league.ts'

export const useLeagueTournPaginated = () => {
  const firstLoad = useRef(true)

  const [leagueList, { data, isLoading, isFetching }] = useLazyGetLeaguesQuery()
  const [leagueItems, setLeagueItems] = useState<IFELeague[]>([])
  const [searchValue, setSearchValue] = useState<string>('')

  const {
    setPaginationParams,
    offset,
    limit
  } = useLeagueSlice()

  /**
   * Fetches first batch of league and tournaments
   */
  useEffect(() => {
    if (firstLoad.current) {
      setLeagueItems([])
      leagueList({ limit: 10, offset: 0 })
      firstLoad.current = false
    }
  }, [])

  /**
   * Fetches leagues by search keyword
   */
  useEffect(() => {
    if (!firstLoad.current) {
      setLeagueItems([])
      leagueList({ limit: 10, offset: 0, league_name: searchValue })
    }
  }, [searchValue, firstLoad.current])

  // updates local master team list
  useEffect(() => {
    if (!data?.leagues) return
    setLeagueItems(league => ([...league, ...data.leagues]))
  }, [data])

  const onSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  /**
   * Adds a single Master Team to the list.
   * Useful for fetching a single master team externally and adding to the list.
   * @param item
   */
  const addItem = useCallback((item: IFELeague) => {
    setLeagueItems(list => [...list, item])
  }, [])

  const loadMore = useCallback(() => {
    const leagueTeamsRequestParams = {
      offset: offset + 10,
      league_name: searchValue || undefined,
      limit
    }

    leagueList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      order_by: null
    })
  }, [limit, offset, searchValue])

  return {
    leagueItems,
    isLoading,
    isFetching,
    loadedData: data,
    loadMore,
    onSearch,
    addItem
  }
}
