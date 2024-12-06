import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormikContext } from 'formik'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useLazyGetUserDetailsQuery, useLazyGetUsersQuery } from '@/redux/user/user.api.ts'
import { IFEUser, IGetUsersRequestParams } from '@/common/interfaces/user.ts'
import Select from '@/components/Inputs/Select.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { ILeagueForm } from '@/common/interfaces/league.ts'

/**
 * Dropdown component for selecting a Master Team Administrator.
 *
 * This component integrates with Formik to manage form state
 * and provides a paginated dropdown for selecting team administrators.
 * It also autofills the email of the selected administrator and
 * supports fetching additional data dynamically.
 *
 * Features:
 * - Fetches initial list of team administrators on mount.
 * - Dynamically loads more team administrators as needed.
 * - Ensures selected administrator details are available in the dropdown.
 * - Populates an email field with the selected administrator's email.
 */
export const MasterTeamAdminDropdown = () => {
  const {
    values, errors, touched, handleChange, handleBlur, setFieldValue
  } = useFormikContext<ILeagueForm>()

  const { setPaginationParams, offset, total, limit } = useUserSlice()

  const [teamAdminList, { isLoading, isFetching, data }] = useLazyGetUsersQuery()
  const [getTeamAdmin, { data: singleTeamAdmin }] = useLazyGetUserDetailsQuery()
  const [masterTeamAdminItems, setMasterTeamAdminItems] = useState<IFEUser[]>([])

  /**
   * Fetches the initial list of team administrators when the component mounts.
   */
  useEffect(() => {
    teamAdminList({ limit: 10, offset: 0, ordering: undefined, role: 'team_admin' })
  }, [])

  /**
   * Updates the local state with the fetched list of team administrators.
   */
  useEffect(() => {
    if (data) {
      setMasterTeamAdminItems(mt => [...mt, ...data.data])
    }
  }, [data])

  /**
   * Updates the email field with the email of the selected team administrator.
   */
  useEffect(() => {
    if (values.masterTeamAdmin) {
      const index = masterTeamAdminItems.findIndex(mt => mt.id === values.masterTeamAdmin)
      const email = index >= 0 ? masterTeamAdminItems[index]?.email : ''
      setFieldValue('masterTeamAdminEmail', email)
    }
  }, [values.masterTeamAdmin, masterTeamAdminItems])

  /**
   * Fetches details of the selected team administrator if not present in the list.
   */
  useEffect(() => {
    if (!values.masterTeamAdmin || !masterTeamAdminItems.length) return

    const currentAdmin = masterTeamAdminItems.find(admin => admin.id === values.masterTeamAdmin)
    if (!currentAdmin) {
      getTeamAdmin({ id: values.masterTeamAdmin })
    }
  }, [values.masterTeamAdmin, masterTeamAdminItems])

  /**
   * Adds the fetched single team administrator to the local state.
   */
  useEffect(() => {
    if (singleTeamAdmin) {
      setMasterTeamAdminItems(items => [...new Set([...items, singleTeamAdmin])])
    }
  }, [singleTeamAdmin])

  /**
   * Determines if all administrators have been loaded.
   */
  const endReached = useMemo(() => (
    masterTeamAdminItems.length >= total
  ), [masterTeamAdminItems, total])

  /**
   * Loads more team administrators when the dropdown reaches the end of the current list.
   */
  const onLoadMore = useCallback(() => {
    if (endReached) return

    const params: IGetUsersRequestParams = {
      offset: offset + 10,
      limit,
      role: 'team_admin'
    }

    teamAdminList(params)
    setPaginationParams({ offset: params.offset, limit: params.limit })
  }, [endReached, offset, limit])

  /**
   * Formats the list of administrators for the dropdown options.
   */
  const masterTeamAdmins = useMemo(() => (
    masterTeamAdminItems.map(admin => ({
      value: admin.id,
      label: `${admin.firstName} ${admin.lastName}`
    }))
  ), [masterTeamAdminItems])

  return (
    <>
      <Select
        showSearch
        errorPosition="bottom"
        loading={isLoading || isFetching}
        label="Master Team Administrator *"
        placeholder="Select master team administrator"
        optionFilterProp="label"
        onLoadMore={!endReached ? onLoadMore : undefined}
        value={values.masterTeamAdmin}
        onChange={handleChange('masterTeamAdmin')}
        options={masterTeamAdmins}
        error={touched.masterTeamAdmin ? (errors.masterTeamAdmin as string) : ''}
        onBlur={handleBlur('masterTeamAdmin')}
      />
      <TextInput
        label="League Team Admin Email *"
        name="masterTeamAdminEmail"
        value={values?.masterTeamAdminEmail || ''}
        onChange={handleChange}
        placeholder="Master team admin email"
        className="h-32"
        error={touched.masterTeamAdminEmail ? (errors.masterTeamAdminEmail as string) : undefined}
        onBlur={handleBlur}
        disabled={true}
      />
    </>
  )
}
