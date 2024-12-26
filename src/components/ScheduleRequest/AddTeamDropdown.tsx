import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNotification } from '@/hooks/useNotification.ts'
import { Dropdown, IDropdownProps } from '@/components/Dropdown'

const DEFAULT_ERROR_MESSAGE = 'Could not load league teams list. Please, try again!'

interface IAddTeamDropdownProps {
  teams: IDropdownProps['items']
  count?: number
  isError: boolean
  isLoading: boolean
  isFetching: boolean
  searchQuery: string

  loadMore(): void

  setSearchQuery(value: string): void

  onSubmit(value: string): void
}

export const AddTeamDropdown = React.memo((props: IAddTeamDropdownProps) => {
  const { notify } = useNotification()

  const {
    teams,
    isFetching,
    isLoading,
    isError,
    count,
    loadMore,
    setSearchQuery,
    onSubmit,
    searchQuery
  } = props

  const [offset, setOffset] = useState(0)

  /**
   * Shows an error toast if isError is true
   */
  useEffect(() => {
    if (!isError) return

    notify(DEFAULT_ERROR_MESSAGE, 'error')
  }, [isError])

  /**
   * Boolean value to whether the list has ended or not
   */
  const endReached = useMemo(() => (
    teams.length >= (count || 0)
  ), [teams])

  /**
   * Handles loading next pages
   */
  const onLoadMore = useCallback(() => {
    if (endReached) return
    const newOffset = offset + 10

    loadMore()

    setOffset(newOffset)
  }, [endReached, offset, searchQuery])

  return (
    <Dropdown
      items={teams}
      buttonTitle="Add team"
      loading={isLoading || isFetching}
      onLoadMore={!endReached ? onLoadMore : undefined}
      onSearch={setSearchQuery}
      onSubmit={onSubmit}
    />
  )
}, (prev, next) => {
  return (
    prev.count === next.count
    && prev.teams === next.teams
    && prev.isError === next.isError
    && prev.isLoading === next.isLoading
    && prev.isFetching === next.isFetching
    && prev.searchQuery === next.searchQuery
  )
})
