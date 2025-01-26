import { useCallback, useEffect, useRef, useState } from 'react'

import { useLazyGetLeagueTeamQuery, useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api'

import { makeUniqueById } from '@/utils'

import { IFELeagueTeam, IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'

type TLeagueTeamsPaginatedParams = {
  seasonId?: string
}

export const useLeagueTeamPaginated = (props: TLeagueTeamsPaginatedParams) => {
  const { seasonId } = props

  const firstLoad = useRef(true)
  const filter = seasonId ? { season: seasonId } : {}

  const [offset, setOffset] = useState(0)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  const [leagueTeamList, { isLoading, isFetching, data }] = useLazyGetLeagueTeamsQuery()
  const [getLeagueTeam, singleData] = useLazyGetLeagueTeamQuery()
  const [leagueTeamItems, setLeagueTeamItems] = useState<IFELeagueTeam[]>([])

  // fetches first batch of league teams
  useEffect(() => {
    if (firstLoad?.current) {
      const params = { limit, offset, ...filter }

      setLeagueTeamItems([])
      setOffset(0)
      setTotal(0)

      leagueTeamList(params)
        .unwrap()
        .then(
          (response) => {
            if (response?.count) {
              setTotal(response.count)
            }
          })
      firstLoad.current = false
    }
  }, [seasonId])

  // updates local league team list
  useEffect(() => {
    if (!data?.results) return
    setLeagueTeamItems((lt) => makeUniqueById([...lt, ...data.results]))
    if (data.count !== undefined) {
      setTotal(data.count)
    }
  }, [data])

  /**
   * Adds a single League Team to the list.
   * Useful for fetching a single league team externally and adding to the list.
   * @param item
   */
  const addItem = useCallback((item: IFELeagueTeam) => {
    setLeagueTeamItems((list) => makeUniqueById([...list, item]))
  }, [])

  const loadMore = useCallback(() => {
    if (leagueTeamItems.length >= total) return

    const leagueTeamsRequestParams: IGetLeagueTeamsRequest = {
      offset: offset + limit,
      limit,
    }

    leagueTeamList(leagueTeamsRequestParams)
    setOffset(leagueTeamsRequestParams.offset)
  }, [limit, offset, leagueTeamItems, total])

  return {
    leagueTeamItems,
    isLoading,
    isFetching,
    loadedData: data,
    loadMore,
    addItem,
    getLeagueTeam,
    singleData,
  }
}
