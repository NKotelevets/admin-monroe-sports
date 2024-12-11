import { IDropdownProps } from '@/components/Dropdown'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'
import { AddTeamDropdown } from '@/components/ScheduleRequest/AddTeamDropdown.tsx'

export const AddLeagueTeamDropdown = () => {
  const { selectedIds } = useContext(ScheduleContext)

  const [offset, setOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [teams, setTeams] = useState<IDropdownProps['items']>([])
  const [leagueTeamsList, { data, isLoading, isError, isFetching }] = useLazyGetLeagueTeamsQuery()

  /**
   * Fetches first teams on mount
   */
  useEffect(() => {
    leagueTeamsList({
      limit: 10,
      offset
    })
  }, [])

  /**
   * Formats and accumulates fetched teams
   */
  useEffect(() => {
    if (!data) return

    const teamOptions = data.results
      .map(team => (
        { label: team.name, value: team.id, disabled: selectedIds?.includes(team.id) }
      ))

    setTeams(prev => [...prev, ...teamOptions])
  }, [data, selectedIds])

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


  return (
    <AddTeamDropdown
      teams={teams}
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
