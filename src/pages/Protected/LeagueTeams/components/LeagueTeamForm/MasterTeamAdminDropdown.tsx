import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormikContext } from 'formik'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'
import { useLazyGetUsersQuery } from '@/redux/user/user.api.ts'
import { IFEUser, IGetUsersRequestParams } from '@/common/interfaces/user.ts'
import Select from '@/components/Inputs/Select.tsx'
import TextInput from '@/components/Inputs/TextInput.tsx'
import { ILeagueForm } from '@/common/interfaces/league.ts'

export const MasterTeamAdminDropdown = React.memo(() => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ILeagueForm>()

  const {
    setPaginationParams,
    offset,
    total,
    limit
  } = useUserSlice()

  const [teamAdminList, { isLoading, isFetching, data }] = useLazyGetUsersQuery()
  const [masterTeamAdminItems, setMasterTeamAdminItems] = useState<IFEUser[]>([])

  // first fetch
  useEffect(() => {
    teamAdminList({ limit: 10, offset: 0, ordering: undefined, role: 'team_admin' })
  }, [])

  // update loaded items
  useEffect(() => {
    !!data && setMasterTeamAdminItems(mt => ([...mt, ...data.data]))
  }, [data])

  // updates team admin email field
  useEffect(() => {
    if (values.masterTeamAdmin) {
      const mt = masterTeamAdminItems.findIndex(mt => mt.id === values.masterTeamAdmin)
      setFieldValue('masterTeamAdminEmail', mt >= 0 ? masterTeamAdminItems[mt]?.email : '')
    }
  }, [values.masterTeamAdmin, masterTeamAdminItems])

  const endReached = useMemo(() => (
    masterTeamAdminItems.length >= total
  ), [masterTeamAdminItems, total])

  const onLoadMore = useCallback(() => {
    if (endReached) return

    const leagueTeamsRequestParams: IGetUsersRequestParams = {
      offset: offset + 10,
      limit,
      role: 'team_admin'
    }

    teamAdminList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit
    })
  }, [endReached, offset, limit])

  // dropdown options
  const masterTeamAdmins = useMemo(() => (
    masterTeamAdminItems.map(admin => ({ value: admin.id, label: `${admin.firstName} ${admin.lastName}` }))
  ), [masterTeamAdminItems])

  return (
    <>
      <Select
        showSearch
        loading={isLoading || isFetching}
        label="Master Team Administrator *"
        placeholder="Select master team administrator"
        optionFilterProp="label"
        onLoadMore={!endReached ? onLoadMore : undefined}
        value={values.masterTeamAdmin}
        onChange={handleChange('masterTeamAdmin')}
        options={masterTeamAdmins}
        error={touched.masterTeamAdmin ? errors.masterTeamAdmin as string : ''}
        onBlur={handleBlur('masterTeamAdmin')}
      />
      <TextInput
        label="League Team Admin Email *"
        name="masterTeamAdminEmail"
        value={values?.masterTeamAdminEmail || ''}
        onChange={handleChange}
        placeholder="Master team admin email"
        className="h-32"
        error={touched.masterTeamAdminEmail ? errors.masterTeamAdminEmail as string : undefined}
        onBlur={handleBlur}
        disabled={true}
      />
    </>
  )
}, () => true)
