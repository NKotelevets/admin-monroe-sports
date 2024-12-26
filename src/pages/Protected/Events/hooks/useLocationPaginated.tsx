import { useLocationsSlice } from '@/redux/hooks/useLocationsSlice'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLazyListLocationQuery } from '@/redux/locations/locations.api.ts'
import { ILocation } from '@/common/interfaces/event.ts'
import { TListLocationResponse } from '@/common/types/events.ts'

export const useLocationPaginated = () => {
  const firstLoad = useRef(true)

  const {
    locations,
    total,
    setPaginationParams,
    offset,
    limit
  } = useLocationsSlice()

  const [listLocation, { isLoading, isFetching, data }] = useLazyListLocationQuery()
  const [locationItems, setLocationItems] = useState<ILocation[]>([])

  // fetches first batch of locations
  useEffect(() => {
    if (firstLoad.current) {
      setLocationItems([])
      listLocation({ limit: 10, offset: 0, ordering: undefined })
      firstLoad.current = false
    }
  }, [])

  // updates local master team list
  useEffect(() => {
    if (!data?.results) return
    setLocationItems(loc => ([...loc, ...data.results]))
  }, [data])

  /**
   * Adds a single Master Team to the list.
   * Useful for fetching a single master team externally and adding to the list.
   * @param item
   */
  const addItem = useCallback((item: ILocation) => {
    setLocationItems(list => [...list, item])
  }, [])

  const loadMore = useCallback(() => {
    const leagueTeamsRequestParams: Omit<TListLocationResponse, 'results' | 'total'> = {
      offset: offset + 10,
      limit
    }

    listLocation(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      ordering: undefined
    })
  }, [limit, offset])

  /**
   * Holds value if list has reached the end
   */
  const endReached = useMemo(() => (
    locationItems.length >= total
  ), [locationItems, total])

  return {
    locations,
    locationItems,
    endReached,
    isLoading,
    isFetching,
    loadedData: data,
    loadMore,
    addItem
  }
}
