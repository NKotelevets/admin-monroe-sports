import { getIn, useFormikContext } from 'formik'
import { ReactElement, useEffect, useMemo } from 'react'

import { useMasterTeamPaginated } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamPaginated.ts'

import Select from '@/components/Inputs/Select.tsx'

import { useLazyGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api.ts'

import { IEventForm } from '@/common/interfaces/event.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'

type TMasterTeamSelectProps = {
  fieldName: string
  isTeam1: boolean
  touched: boolean
  error?: string
  noMargin?: boolean
  label?: string
}

/**
 * A functional React component used for selecting a "Master Team" from a list of teams.
 * It integrates with Formik for form state management and utilizes a paginated data loading mechanism for team data.
 *
 * @param {TMasterTeamSelectProps} props - The props for the MasterTeamSelect component.
 * @returns {ReactElement} - A Select component for choosing a team from the available master team options.
 *
 * Description:
 * - This component allows users to select a team from a list of options that can be paginated and fetched dynamically.
 * - It supports lazy fetching of additional team details when a team value is selected that doesn't exist in the current list.
 * - The component dynamically filters options based on the selected team (team1 or team2) to avoid duplicates.
 *
 * Features:
 * - Integrates with Formik's context to manage form values and touched state.
 * - Uses memoization to optimize render performance by minimizing unnecessary calculations for field values and team options.
 * - Includes a loading indicator to display while fetching or loading more team options.
 * - Displays error messages if form validation fails on the field.
 *
 * Dependencies:
 * - useFormikContext: To retrieve and interact with the Formik form context.
 * - useMasterTeamPaginated: Custom hook for managing paginated team data and associated actions.
 * - useLazyGetMasterTeamQuery: Custom hook for lazily fetching team details.
 */
export const MasterTeamSelect = (props: TMasterTeamSelectProps): ReactElement => {
  const { fieldName, isTeam1, error, touched, label, noMargin } = props
  const { values, setFieldValue, setFieldTouched } = useFormikContext<IEventForm>()
  const { masterTeamItems, loadMore, isLoading, isFetching, addItem } = useMasterTeamPaginated()

  const [getMasterTeam] = useLazyGetMasterTeamQuery()

  const fieldValue = useMemo(() => getIn(values, fieldName), [values, fieldName])
  const pairFieldName = useMemo(
    () => (isTeam1 ? fieldName.replace('team1Id', 'team2Id') : fieldName.replace('team2Id', 'team1Id')),
    [isTeam1, fieldName],
  )
  const pairValue = useMemo(() => getIn(values, pairFieldName), [values, pairFieldName])

  useEffect(() => {
    if (!fieldValue) return
    const mt = masterTeamItems.find((mt) => mt.id === (fieldValue as string))

    if (!mt) {
      getMasterTeam({ id: fieldValue as string })
        .unwrap()
        .then((response) => {
          const current = {
            ...response,
            headCoachFullName: response.headCoach.fullName,
            id: fieldValue as string,
          } as unknown as IFEMasterTeam
          addItem(current)
        })
      return
    }
  }, [masterTeamItems, fieldValue, fieldName])

  const teamOptions = useMemo(() => {
    const list = masterTeamItems?.map((mt) => ({ label: mt.name, value: mt.id }))

    return list.filter((mt) => mt.value !== pairValue)
  }, [masterTeamItems, pairValue])

  return (
    <>
      <Select
        noMargin={noMargin}
        label={label || ''}
        onLoadMore={loadMore}
        placeholder="Select team"
        buttonText="Add Master Team"
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
