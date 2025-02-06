import { useEffect, useState } from 'react'
import Select, { IDropdownProps } from '@/components/Inputs/Select.tsx'
import { useLazyGetLeagueQuery, useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api.ts'
import { IFELeague } from '@/common/interfaces/league.ts'
import { makeUniqueById } from '@/utils'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice.ts'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'

type TLeagueSelectProps = IDropdownProps & { getLeague?(division: IFELeague): void }

export const LeagueSelect = (props: TLeagueSelectProps) => {
  const { value, disabled, getLeague: getLeagueObj, ...rest } = props
  const { limit, offset, total, setPaginationParams } = useLeagueSlice()

  const [getLeague, { isLoading: isLoadingSingle, isFetching: isFetchingSingle }] = useLazyGetLeagueQuery()
  const [listLeague, { isLoading, isFetching }] = useLazyGetLeaguesQuery()

  const [leagueList, setLeagueList] = useState<IFELeague[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  function loadFirstBatch(search?: string) {
    setPaginationParams({ limit: 10, offset: 0, order_by: null })

    listLeague({ limit, offset: 0, order_by: null, league_name: search })
      .unwrap()
      .then(resp => {
        updateLeagueList(resp.leagues)
      })
  }

  /**
   * Lists first leagues
   */
  useEffect(() => {
    loadFirstBatch()
  }, [])

  /**
   * Handles debounced search
   */
  useDebounceEffect(() => {
    loadFirstBatch(searchQuery)
  }, [searchQuery])

  /**
   * Get a league by id if it's not on the list
   */
  useEffect(() => {
    if (!!leagueList.length && value) {
      const find = leagueList.find(league => league.id === value)

      if (!find && !isLoadingSingle && !isFetchingSingle) {
        getLeague(value)
          .unwrap()
          .then(resp => updateLeagueList([resp]))
      }
    }
  }, [value, leagueList])

  /**
   * Passes the division to parent if getDivision is set
   */
  useEffect(() => {
    if (!!leagueList.length && value) {
      const find = leagueList.find(league => league.id === value)
      if (find) {
        !!getLeagueObj && getLeagueObj(find)
      }
    }
  }, [value, leagueList])

  /**
   * Updates the list with unique values
   * @param leagues
   */
  const updateLeagueList = (leagues: IFELeague[]) => {
    setLeagueList(prev => makeUniqueById([...prev, ...leagues]) as IFELeague[])
  }

  /**
   * Handles infinite scrolling
   */
  const onLoadMore = () => {
    if (leagueList.length >= total) return
    if (isLoading || isFetching) return

    const newPaginationProps = {
      limit,
      offset: offset + limit,
      order_by: null,
      name: searchQuery
    }

    listLeague(newPaginationProps)
      .unwrap()
      .then(resp => {
        updateLeagueList(resp.leagues)
      })

    setPaginationParams(newPaginationProps)
  }

  const onSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <Select
      {...rest}
      showSearch
      disabled={isFetchingSingle || isLoadingSingle || disabled}
      onSearch={onSearch}
      onLoadMore={onLoadMore}
      value={value}
      loading={isLoading || isFetching}
      label="League *"
      placeholder={isFetchingSingle || isLoadingSingle ? 'Loading...' : 'Select league'}
      optionFilterProp="label"
      options={leagueList.map(league => ({ value: league.id, label: league.name }))}
    />
  )
}
