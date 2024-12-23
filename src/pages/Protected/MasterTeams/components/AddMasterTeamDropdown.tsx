import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'
import { AddTeamDropdown } from '@/components/ScheduleRequest/AddTeamDropdown.tsx'
import { TScheduleAdditionalData } from '@/common/types'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'

export const AddMasterTeamDropdown = () => {
  const [offset, setOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [teams, setTeams] = useState<IFEMasterTeam[]>([])
  const [
    teamsList,
    { data, isLoading, isError, isFetching }
  ] = useLazyGetMasterTeamsQuery()

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
    teamsList({
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

    teamsList({
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
      masterTeamName: undefined,
      masterTeamId: undefined,
      leagueName: undefined
    } as TScheduleAdditionalData]

    navigateWithData(newAdditionalData, dates?.start, dates?.end)
  }, [teams, dates])

  const ids = useMemo(() => (
    additionalData ? additionalData.map(addD => addD.id) : []
  ), [additionalData])

  const options = useMemo(() => teams.map(team => (
    { label: team.name, value: team.id, disabled: ids?.includes(team.id) }
  )), [teams, ids])


  return (
    <AddTeamDropdown
      teams={options}
      onSubmit={onSubmit}
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
