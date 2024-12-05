import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IFELeague, IGetLeaguesRequestParams, ILeagueForm } from '@/common/interfaces/league.ts'
import { useFormikContext } from 'formik'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice.ts'
import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api.ts'
import Select from '@/components/Inputs/Select.tsx'

export const LeagueTournDropdown = React.memo((props: { setSelectedLeague: (league: IFELeague) => void }) => {
  const { setSelectedLeague } = props
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur
  } = useFormikContext<ILeagueForm>()

  const {
    setPaginationParams,
    offset,
    total
  } = useLeagueSlice()

  const [leaguesList, { isLoading, isFetching, data }] = useLazyGetLeaguesQuery()
  const [leagueItems, setLeagueItems] = useState<IFELeague[]>([])

  // reset pagination and fetch leagues
  useEffect(() => {
    setPaginationParams({ offset: 0, limit: 10, order_by: null })
    leaguesList({ offset: 0, limit: 10, order_by: null })
  }, [])

  // accumulate fetch results
  useEffect(() => {
    setLeagueItems(lg => [...lg, ...(data?.leagues || [])])
  }, [data])

  // set current selected league to state
  useEffect(() => {
    if (!values.league) return
    const currentLeague = leagueItems.find(league => league.id === values.league)
    !!currentLeague && setSelectedLeague(currentLeague)
  }, [values.league, leagueItems])

  const onLoadMore = useCallback(() => {
    if (endReached) return

    const leagueTeamsRequestParams: IGetLeaguesRequestParams = {
      offset: offset + 10,
      limit: 10,
      order_by: null
    }

    leaguesList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      order_by: null
    })
  }, [offset])

  const leagueOptions = useMemo(() => (
    leagueItems.map(mt => ({ label: mt.name, value: mt.id }))
  ), [leagueItems])

  const endReached = useMemo(() => (
    leagueItems.length >= total
  ), [leagueItems, total])

  return (
    <Select
      showSearch
      loading={isLoading || isFetching}
      label="League/Tournment *"
      placeholder="Select legue/tourn"
      optionFilterProp="label"
      value={values.league}
      onChange={handleChange('league')}
      onLoadMore={!endReached ? onLoadMore : undefined}
      options={leagueOptions}
      error={touched.league ? errors.league as string : ''}
      onBlur={handleBlur('league')}
    />
  )
}, (prev, next) =>
  prev.setSelectedLeague === next.setSelectedLeague
)
