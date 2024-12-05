import { Dropdown, IDropdownProps } from '@/components/Dropdown'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { ScheduleContext } from '@/components/ScheduleRequest/ScheduleContext.ts'
import { useNotification } from '@/hooks/useNotification.ts'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'
import { useNavigate } from 'react-router-dom'

const DEFAULT_ERROR_MESSAGE = 'Could not load master teams list. Please, try again!'

export const AddMasterTeamDropdown = () => {
  const navigate = useNavigate()
  const { selectedIds, setSelectedIds, pathToNavigate, dates } = useContext(ScheduleContext)
  const { notify } = useNotification()

  const [offset, setOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [teams, setTeams] = useState<IDropdownProps['items']>([])
  const [teamsList, { data, isLoading, isError, isFetching }] = useLazyGetMasterTeamsQuery()

  /**
   * Fetches first teams on mount
   */
  useEffect(() => {
    teamsList({
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

    setTeams(curr => [...curr, ...teamOptions])
  }, [data])

  /**
   * Shows an error toast if isError is true
   */
  useEffect(() => {
    if (!isError) return

    notify(DEFAULT_ERROR_MESSAGE, 'error')
  }, [isError])

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
   * Boolean value to whether the list has ended or not
   */
  const endReached = useMemo(() => (
    teams.length >= (data?.count || 0)
  ), [data, teams])

  /**
   * Handles loading next pages
   */
  const onLoadMore = useCallback(() => {
    if (endReached) return
    const newOffset = offset + 10

    teamsList({
      limit: 10,
      offset: newOffset,
      name: searchQuery ? searchQuery : undefined
    })

    setOffset(newOffset)
  }, [endReached, offset, searchQuery])

  /**
   * Handles adding team to list
   * @param value
   */
  const onSubmit = useCallback((value: string) => {
    const newIds = [...selectedIds || [], value]

    setSelectedIds(newIds)
    navigate(`${pathToNavigate}/${dates?.start},${dates?.end}/${newIds?.join(',')}`)
  }, [selectedIds])

  return (
    <Dropdown
      items={teams}
      buttonTitle='Add team'
      loading={isLoading || isFetching}
      onLoadMore={!endReached ? onLoadMore : undefined}
      onSearch={setSearchQuery}
      onSubmit={onSubmit}
    />
  )
}
