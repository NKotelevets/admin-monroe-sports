import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IFELeague, IGetLeaguesRequestParams, ILeagueForm } from '@/common/interfaces/league.ts'
import { useFormikContext } from 'formik'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice.ts'
import { useLazyGetLeagueQuery, useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api.ts'
import Select from '@/components/Inputs/Select.tsx'

/**
 * LeagueTournDropdown Component
 *
 * A dropdown component for selecting leagues/tournaments.
 * Integrates with Formik for form state management and Redux for managing league data.
 *
 * @param props - Component props
 * @param props.setSelectedLeague - Callback to set the selected league in the parent state
 */
export const LeagueTournDropdown = React.memo((props: { setSelectedLeague: (league: IFELeague) => void }) => {
    const { setSelectedLeague } = props

    /**
     * Extracts form state and handlers from Formik context
     */
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur
    } = useFormikContext<ILeagueForm>()

    /**
     * Extracts pagination parameters and slice state management utilities
     */
    const {
      setPaginationParams,
      offset,
      total
    } = useLeagueSlice()

    /**
     * Queries for fetching leagues and a single league
     */
    const [leaguesList, { isLoading, isFetching, data }] = useLazyGetLeaguesQuery()
    const [getLeague, { data: singleLeague }] = useLazyGetLeagueQuery()
    const [leagueItems, setLeagueItems] = useState<IFELeague[]>([])

    /**
     * Effect to reset pagination and fetch the initial list of leagues
     */
    useEffect(() => {
      setPaginationParams({ offset: 0, limit: 10, order_by: null })
      leaguesList({ offset: 0, limit: 10, order_by: null })
    }, [])

    /**
     * Effect to accumulate fetched league data into the state
     */
    useEffect(() => {
      setLeagueItems(lg => [...lg, ...(data?.leagues || [])])
    }, [data])

    /**
     * Effect to update the selected league in the parent state when the league value changes
     */
    useEffect(() => {
      if (!values.league) return
      const currentLeague = leagueItems.find(league => league.id === values.league)
      if (currentLeague) {
        setSelectedLeague(currentLeague)
        return
      }

      getLeague(values.league || '')
    }, [values.league, leagueItems])

    /**
     * Effect to add a newly fetched single league to the state
     */
    useEffect(() => {
      if (!singleLeague) return
      setLeagueItems(items => [...items, singleLeague])
    }, [singleLeague])

    /**
     * Loads more leagues by updating the pagination parameters and fetching the next set of leagues.
     */
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

    /**
     * Maps the league items to dropdown options.
     */
    const leagueOptions = useMemo(() => (
      leagueItems.map(mt => ({ label: mt.name, value: mt.id }))
    ), [leagueItems])

    /**
     * Determines if all leagues have been loaded based on the total count.
     */
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
