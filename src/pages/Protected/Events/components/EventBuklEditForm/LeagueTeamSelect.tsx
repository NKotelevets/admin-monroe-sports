import { getIn, useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

import { useLeagueTeamPaginated } from '@/pages/Protected/LeagueTeams/hooks/useLeagueTeamPaginated.ts'

import Select from '@/components/Inputs/Select.tsx'

import { useLazyGetLeagueTeamQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'

import { IEventForm } from '@/common/interfaces/event.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'

type TLeagueTeamSelectProps = {
  fieldName: string
  isTeam1: boolean
  touched: boolean
  error?: string
  noMargin?: boolean
  label?: string
}

/**
 * Component `LeagueTeamSelect`
 *
 * A React functional component used to render a selection dropdown for choosing a league team.
 * It integrates with a form management library (e.g., Formik) and handles dynamic data fetching, filtering,
 * and state management for league team options.
 * Ideally this should be refactored so we can have a single league team selector for the whole project.
 *
 * Props:
 * - `fieldName`: The name of the field in the form to be managed.
 * - `isTeam1`: A boolean indicating whether this component is for the first team or not.
 * - `error`: A string representing any validation error associated with the field.
 * - `touched`: A boolean indicating whether the field has been touched for validation.
 * - `label`: An optional label for the select dropdown.
 *
 * Internal behavior:
 * - Leverages the `useFormikContext` hook to access and modify form values.
 * - Utilizes data fetching to retrieve league teams via `useLeagueTeamPaginated` and `useLazyGetLeagueTeamQuery`.
 * - Automatically populates the selection options while filtering out conflicting teams.
 * - Handles state management for the selected team and dynamically updates data and dependencies.
 *
 * Features:
 * - Renders a `Select` component with:
 *   - A dynamically generated list of options for league teams.
 *   - Support for loading more options when the user scrolls.
 *   - Real-time validation and error display based on input.
 *   - Integration with `Formik` for automatic binding to form values and validation state.
 *   - Filtering to prevent duplicate or conflicting team selections.
 *
 * Dependencies:
 * - React hooks such as `useState`, `useEffect`, and `useMemo` for state and performance optimization.
 * - External hooks such as `useLeagueTeamPaginated` and `useLazyGetLeagueTeamQuery` for data fetching.
 * - Utility functions like `getIn` for retrieving nested values from the form.
 *
 * Returns:
 * A dropdown component ready to be integrated into a form where users can select a specific league team.
 */
export const LeagueTeamSelect = (props: TLeagueTeamSelectProps) => {
  const { fieldName, isTeam1, error, touched, label, noMargin } = props
  const { values, setFieldValue, setFieldTouched } = useFormikContext<IEventForm>()

  // const isDisabled = !isTeam1 && !values.season
  const params = {
    seasonId: !isTeam1 ? values.season : undefined,
  }

  const { leagueTeamItems, loadMore, isLoading, isFetching, addItem } = useLeagueTeamPaginated(params)

  const [getLeagueTeam, { data: leagueTeamAdded, isLoading: isLoadingSingle }] = useLazyGetLeagueTeamQuery()
  const [, setCurrentLT] = useState<IFELeagueTeam | undefined>(undefined)

  /**
   * Retrieves the value at the specified field name from a nested object.
   *
   * @param {Object} values - The object to retrieve the field value from.
   * @param {string} fieldName - The path of the field to access in dot notation.
   * @return {*} The value at the specified field path, or undefined if not found.
   */
  const fieldValue = useMemo(() => getIn(values, fieldName), [values, fieldName])

  /**
   * A memoized variable that determines the paired field name based on the current team context.
   *
   * Replaces 'team1Id' with 'team2Id' or vice versa in the provided `fieldName`,
   * depending on the value of `isTeam1`.
   *
   * @constant {string} pairFieldName
   * @param {boolean} isTeam1 - Indicator of whether the current team context is Team 1.
   * @param {string} fieldName - The original field name string to be modified.
   */
  const pairFieldName = useMemo(
    () => (isTeam1 ? fieldName.replace('team1Id', 'team2Id') : fieldName.replace('team2Id', 'team1Id')),
    [isTeam1, fieldName],
  )
  const pairValue = useMemo(() => getIn(values, pairFieldName), [values, pairFieldName])

  /**
   * Handles the logic for managing league team items based on the provided field value.
   * - Checks if fieldValue or isLoadingSingle is falsy and exits early.
   * - Searches for a matching league team item using fieldValue.
   * - Fetches a league team if none exists and leagueTeamAdded is undefined.
   * - Adds a new league team item if leagueTeamAdded is available but no matching item is found.
   * - Updates the current league team with the found team or performs necessary actions.
   */
  useEffect(() => {
    if (!fieldValue || isLoadingSingle) return
    const mt = leagueTeamItems.find((mt) => mt.id === (fieldValue as string))

    if (!mt && leagueTeamAdded === undefined) {
      getLeagueTeam({ id: fieldValue as string })
      return
    }

    if (!mt && leagueTeamAdded) {
      addItem({
        ...leagueTeamAdded,
        id: fieldValue,
      } as unknown as IFELeagueTeam)
    }

    setCurrentLT(mt)
  }, [leagueTeamItems, fieldValue, fieldName, leagueTeamAdded, isLoadingSingle])

  /**
   * Memoized variable containing filtered options for teams.
   *
   * The `teamOptions` variable computes a list of team options derived from
   * `leagueTeamItems`. Each option includes a label and value mapped from
   * `leagueTeamItems`. After mapping, it filters out any option where the
   * `value` matches `pairValue`.
   *
   * Dependencies:
   * - `leagueTeamItems`: The source array of team objects, each containing properties such as `name` and `id`.
   * - `pairValue`: A value used to filter out a specific option from the generated list.
   *
   * Returns:
   * A filtered list of objects, where each object has the structure:
   * - `label`: The name of the team.
   * - `value`: The ID of the team.
   */
  const teamOptions = useMemo(() => {
    const list = leagueTeamItems?.map((mt) => ({ label: mt.name, value: mt.id }))

    return list.filter((lt) => lt.value !== pairValue)
  }, [leagueTeamItems, pairValue])

  return (
    <>
      <Select
        noMargin={noMargin}
        label={label || ''}
        // disabled={isDisabled}
        onLoadMore={loadMore}
        placeholder="Select team"
        loading={isLoading || isFetching}
        value={fieldValue}
        options={teamOptions || []}
        onChange={(value) => setFieldValue(fieldName, value)}
        error={touched ? error : undefined}
        onBlur={() => setFieldTouched(fieldName)}
        errorPosition="bottom"
      />
    </>
  )
}
