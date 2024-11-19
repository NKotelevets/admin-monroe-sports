import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormikContext } from 'formik'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'
import Dropdown from '@/components/Inputs/Dropdown.tsx'
import { ILeagueForm } from '@/common/interfaces/league.ts'


export const MasterTeamDropdown = React.memo(() => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ILeagueForm>()

  const {
    masterTeams,
    setPaginationParams,
    offset,
    total,
    limit
  } = useMasterTeamsSlice()

  const [masterTeamList, { isLoading, isFetching }] = useLazyGetMasterTeamsQuery()
  const [masterTeamItems, setMasterTeamItems] = useState<IFEMasterTeam[]>([])
  const [selectedMasterTeam, setSelectedMasterTeam] = useState<IFEMasterTeam | null>(null)

  useEffect(() => {
    masterTeamList({ limit: 10, offset: 0, ordering: undefined })
  }, [])

  useEffect(() => {
    setMasterTeamItems(mt => ([...mt, ...masterTeams]))
  }, [masterTeams])

  useEffect(() => {
    if (values.masterTeam) {
      const mt = masterTeamItems.findIndex(mt => mt.id === values.masterTeam)
      setSelectedMasterTeam(masterTeamItems[mt])
      setFieldValue('masterTeamAdminName', mt ? masterTeamItems[mt]?.teamAdminId : '')
      setFieldValue('teamAdminEmail', mt ? masterTeamItems[mt]?.teamAdminEmail : '')
    }
  }, [values.masterTeam, masterTeamItems])

  const endReached = useMemo(() => (
    masterTeamItems.length >= total
  ), [masterTeamItems, total])

  const onLoadMore = useCallback(() => {
    if (endReached) return

    const leagueTeamsRequestParams: IGetLeagueTeamsRequest = {
      offset: offset + 10,
      limit
    }

    masterTeamList(leagueTeamsRequestParams)
    setPaginationParams({
      offset: leagueTeamsRequestParams.offset,
      limit: leagueTeamsRequestParams.limit,
      ordering: null
    })
  }, [endReached, offset, limit])

  return (
    <>
      <Dropdown
        showSearch
        loading={isLoading || isFetching}
        label="Master Team *"
        placeholder="Select master team"
        optionFilterProp="label"
        value={values.masterTeam}
        onChange={handleChange('masterTeam')}
        onLoadMore={!endReached ? onLoadMore : undefined}
        options={masterTeamItems.map(mt => ({ label: mt.name, value: mt.id }))}
        buttonAction={alert}
        buttonText="Add master team"
        error={touched.masterTeam ? errors.masterTeam as string : ''}
        onBlur={handleBlur('masterTeam')}
      />

      {!!selectedMasterTeam && (
        <>
          <Dropdown
            disabled
            label="Master Team Administrator *"
            placeholder="Select master team"
            optionFilterProp="label"
            value={values.masterTeamAdminName}
            onChange={handleChange('masterTeamAdminName')}
            error={touched.masterTeamAdminName ? errors.masterTeamAdminName as string : ''}
            options={[
              { label: selectedMasterTeam.teamAdminFullName, value: selectedMasterTeam.teamAdminId }
            ]}
            onBlur={handleBlur('masterTeamAdminName')}
          />
          <Dropdown
            disabled
            label="Master Team Admin Email "
            placeholder="Select master team"
            value={values.masterTeamAdminEmail}
            onChange={handleChange('masterTeamAdminEmail')}
            error={touched.masterTeamAdminEmail ? errors.masterTeamAdminEmail as string : ''}
            options={[
              { label: selectedMasterTeam.teamAdminEmail, value: values.masterTeamAdminEmail }
            ]}
            onBlur={handleBlur('masterTeamAdminEmail')}
          />
        </>
      )}
    </>
  )
}, () => true)
