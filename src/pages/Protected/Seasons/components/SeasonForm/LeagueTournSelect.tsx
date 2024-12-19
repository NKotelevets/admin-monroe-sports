import { useFormikContext } from 'formik'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'
import Select from '@/components/Inputs/Select.tsx'
import { useCallback, useEffect, useMemo } from 'react'
import { useLazyGetLeagueQuery } from '@/redux/leagues/leagues.api.ts'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice.ts'
import { useLeagueTournPaginated } from '@/pages/Protected/LeaguesAndTournaments/hooks/useLeagueTournPaginated.tsx'
import { IFELeague } from '@/common/interfaces/league.ts'
import { useSeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/UseSeasonFormContext.tsx'

export const LeagueTournSelect = () => {
  const { total } = useLeagueSlice()
  const { selectedLeague, setSelectedLeague } = useSeasonFormContext()
  const { leagueItems, addItem, isFetching, isLoading, loadMore, onSearch } = useLeagueTournPaginated()
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange
  } = useFormikContext<ICreateSeasonFormValues>()

  const [
    getSingleLeague,
    { data, isLoading: isLoadingSingle }
  ] = useLazyGetLeagueQuery()

  /**
   * Checks if current selected league corresponds to form's league value.
   */
  const checkLeague = useMemo(() => (
    selectedLeague !== null && selectedLeague?.id === values.league
  ), [selectedLeague, values.league])

  /**
   * Fetches league by id (when editing)
   */
  useEffect(() => {
    if (!values.league || selectedLeague || checkLeague || isLoadingSingle) return
    const findLeague = leagueItems.findIndex(league => league.id === values.league)

    if (findLeague < 0 && data === undefined) {
      getSingleLeague(values.league)
      return
    }
  }, [values.league, leagueItems, selectedLeague, isLoadingSingle, checkLeague])

  /**
   * Adds single fetched league to the list
   */
  useEffect(() => {
    if (!values.league || selectedLeague || checkLeague || isLoadingSingle || !data) return
    const findLeague = leagueItems.findIndex(league => league.id === values.league)

    if (findLeague < 0 && data)
      addItem({ ...data, id: values.league! } as IFELeague)

  }, [values.league, data])

  /**
   * Updates selected league/tourn
   */
  useEffect(() => {
    if (values.league) {
      const lt = leagueItems.findIndex(mt => mt.id === values.league)
      setSelectedLeague(leagueItems[lt])
    }
  }, [values.league, leagueItems])

  /**
   * Holds value if list has reached the end
   */
  const endReached = useMemo(() => (
    leagueItems.length >= total
  ), [leagueItems, total])

  /**
   * Triggers loadMore from hook if end is not reached yet
   */
  const onLoadMore = useCallback(() => {
    !endReached && loadMore()
  }, [endReached])

  return (
    <Select
      showSearch
      onSearch={onSearch}
      loading={isLoading || isFetching}
      label="Linked League/Tourn *"
      placeholder="Select league/tournament"
      optionFilterProp="label"
      value={values.league}
      onChange={handleChange('league')}
      onLoadMore={!endReached ? onLoadMore : undefined}
      options={leagueItems.map(league => ({ label: league.name, value: league.id }))}
      error={touched.league ? errors.league as string : ''}
      onBlur={handleBlur('league')}
    />
  )
}
