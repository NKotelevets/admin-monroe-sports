import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'
import { AddTeamDropdown } from '@/components/ScheduleRequest/AddTeamDropdown.tsx'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { TScheduleAdditionalData } from '@/common/types'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'

export const AddLeagueTeamDropdown = () => {
  const [offset, setOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [teams, setTeams] = useState<IFELeagueTeam[]>([])
  const [
    leagueTeamsList,
    { data, isLoading, isError, isFetching }
  ] = useLazyGetLeagueTeamsQuery()

  const {
    navigateWithData,
    additionalData,
    dates
  } = useContext(ScheduleContext)


  /**
   * Formats and accumulates fetched teams
   */
  useEffect(() => {
    if (!data) return
    setTeams(prev => [...prev, ...data.results])
  }, [data])

  /**
   * Handles search field with debounce
   */
  useDebounceEffect(() => {
    leagueTeamsList({
      limit: 10,
      offset: 0,
      name: searchQuery ? searchQuery : undefined
    })
    setTeams([])
    setOffset(0)
  }, [searchQuery])

  /**
   * Handles loading next pages
   */
  const onLoadMore = useCallback(() => {
    const newOffset = offset + 10

    leagueTeamsList({
      limit: 10,
      offset: newOffset,
      name: searchQuery ? searchQuery : undefined
    })

    setOffset(newOffset)
  }, [offset, searchQuery])

  /**
   * Handles adding team to list
   * @param value
   */
  const onSubmit = useCallback((value: string) => {
    const newTeam = teams.find(team => team.id === value)
    const newAdditionalData = [...additionalData || [], {
      id: newTeam?.id,
      name: newTeam?.name,
      masterTeamName: newTeam?.masterTeam?.name,
      masterTeamId: newTeam?.masterTeam?.id,
      leagueName: newTeam?.league.name
    } as TScheduleAdditionalData]

    navigateWithData(newAdditionalData, dates?.start, dates?.end)
  }, [teams, dates])

  const ids = useMemo(() => (
    additionalData ? additionalData.map(addD => addD.id) : []
  ), [additionalData])

  const options = useMemo(() => teams.map(team => (
    { label: `${team.name} ${team.league.name ? `(${team.league.name})` : ''}`, value: team.id, disabled: ids?.includes(team.id) }
  )), [teams, ids])


  return (
    <AddTeamDropdown
      onSubmit={onSubmit}
      teams={options}
      count={data?.count}
      isError={isError}
      isLoading={isLoading}
      isFetching={isFetching}
      loadMore={onLoadMore}
      setSearchQuery={setSearchQuery}
      searchQuery={searchQuery}
    />
  )
}
