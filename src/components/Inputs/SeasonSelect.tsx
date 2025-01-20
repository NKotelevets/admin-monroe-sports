import { useEffect, useState } from 'react'
import Select, { IDropdownProps } from '@/components/Inputs/Select.tsx'
import { useLazyGetSeasonDetailsQuery, useLazyGetSeasonsQuery } from '@/redux/seasons/seasons.api.ts'
import { IFESeason } from '@/common/interfaces/season.ts'
import { makeUniqueById } from '@/utils'
import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice.ts'
import useDebounceEffect from '@/hooks/useDebounceEffect.ts'
import { IFEDivision } from '@/common/interfaces/division.ts'

type TSeasonSelectProps = IDropdownProps & { getDivisions?(division: IFEDivision[]): void }

export const SeasonSelect = (props: TSeasonSelectProps) => {
  const { value, disabled, options, getDivisions, ...rest } = props
  const { limit, offset, total, setPaginationParams } = useSeasonSlice()

  const [getSeason, { isLoading: isLoadingSingle, isFetching: isFetchingSingle }] = useLazyGetSeasonDetailsQuery()
  const [listSeason, { isLoading, isFetching }] = useLazyGetSeasonsQuery()

  const [seasonList, setSeasonList] = useState<IFESeason[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  function loadFirstBatch(search?: string) {
    setPaginationParams({ limit: 10, offset: 0, ordering: null })

    listSeason({ limit, offset: 0, ordering: null, name: search })
      .unwrap()
      .then(resp => {
        updateSeasonList(resp.seasons)
      })
  }

  /**
   * Lists first seasons
   */
  useEffect(() => {
    !!options && loadFirstBatch()
  }, [options])

  /**
   * Fetch full season object for each id on options.
   */
  useEffect(() => {
    if (!options) return

    async function getSeasons() {
      const seasonIds = options?.map(season => season.value) || []
      const seasons = await Promise.all(
        seasonIds.map(async (id) => await getSeason(id as string).unwrap())
      )
      setSeasonList(seasons)
    }

    getSeasons()
  }, [options])

  /**
   * Handles debounced search
   */
  useDebounceEffect(() => {
    loadFirstBatch(searchQuery)
  }, [searchQuery])

  /**
   * Get a season by id if it's not on the list
   */
  useEffect(() => {
    if (!!seasonList.length && value && !options) {
      const find = seasonList.find(season => season.id === value)

      if (!find && !isLoadingSingle && !isFetchingSingle) {
        getSeason(value)
          .unwrap()
          .then(resp => updateSeasonList([resp]))
      }
    }
  }, [value, seasonList, options])

  /**
   * Passes the division to parent if getDivision is set
   */
  useEffect(() => {
    if (!!seasonList.length && value) {
      const find = seasonList.find(season => season.id === value)
      if (find) {
        !!getDivisions && getDivisions(find.divisions)
      }
    }
  }, [value, seasonList])

  /**
   * Updates the list with unique values
   * @param seasons
   */
  const updateSeasonList = (seasons: IFESeason[]) => {
    setSeasonList(prev => makeUniqueById([...prev, ...seasons]) as IFESeason[])
  }

  /**
   * Handles infinite scrolling
   */
  const onLoadMore = () => {
    if (seasonList.length >= total) return
    if (isLoading || isFetching) return

    const newPaginationProps = {
      limit,
      offset: offset + limit,
      ordering: null,
      name: searchQuery
    }

    listSeason(newPaginationProps)
      .unwrap()
      .then(resp => {
        updateSeasonList(resp.seasons)
      })

    setPaginationParams(newPaginationProps)
  }

  const onSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <Select
      {...rest}
      showSearch={!options}
      disabled={isFetchingSingle || isLoadingSingle || disabled}
      onSearch={!options ? onSearch : undefined}
      onLoadMore={!options ? onLoadMore : undefined}
      value={value}
      loading={isLoading || isFetching}
      label="Season *"
      placeholder={isFetchingSingle || isLoadingSingle ? 'Loading...' : 'Select season'}
      optionFilterProp="label"
      options={seasonList.map(season => ({ value: season.id, label: season.name }))}
    />
  )
}
