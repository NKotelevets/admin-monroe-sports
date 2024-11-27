import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormikContext } from 'formik'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { useLazyGetMasterTeamQuery, useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { IGetLeagueTeamsRequest } from '@/common/interfaces/leagueTeams.ts'
import Dropdown from '@/components/Inputs/Dropdown.tsx'
import { ILeagueForm } from '@/common/interfaces/league.ts'

/**
 * MasterTeamDropdown is a functional component that renders a dropdown menu
 * to select a "Master Team" and associated details, with additional actions and controls
 * for handling master teams.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onAddMasterTeam - Callback function triggered when the "Add Master Team" button is clicked.
 * @param {Function} props.setAddingMasterTeam - Callback to toggle the state of adding a new master team.
 *
 * This component integrates with Formik's form context (`useFormikContext`) and interacts
 * with a custom hook (`useMasterTeamsSlice`) for managing master teams state and pagination.
 *
 * Features:
 * - Fetches and displays a paginated list of master teams.
 * - Allows selection of a master team and automatically updates related form fields.
 * - Handles dynamic loading of more master teams when the dropdown reaches the end.
 * - Supports adding new master teams and updating the list with newly created teams.
 * - Displays associated information, such as administrator name and email, in disabled fields.
 *
 * @returns {React.Element} Rendered dropdown UI for master team selection and related fields.
 */
export const MasterTeamDropdown = React.memo((props: {
  onAddMasterTeam(): void,
  setAddingMasterTeam(state: boolean): void
}) => {
  const { onAddMasterTeam } = props

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
  } = useMasterTeamsSlice()

  const firstLoad = useRef(true)
  const [masterTeamList, { isLoading, isFetching, data }] = useLazyGetMasterTeamsQuery()
  const [masterTeamGet, { data: masterTeamAdded }] = useLazyGetMasterTeamQuery()
  const [masterTeamItems, setMasterTeamItems] = useState<IFEMasterTeam[]>([])
  const [selectedMasterTeam, setSelectedMasterTeam] = useState<IFEMasterTeam | null>(null)

  // fetches first batch of master teams
  useEffect(() => {
    if (firstLoad.current) {
      setMasterTeamItems([])
      masterTeamList({ limit: 10, offset: 0, ordering: undefined })
      firstLoad.current = false
    }
  }, [])

  // updates local master team list
  useEffect(() => {
    if (!data?.results) return
    setMasterTeamItems(mt => ([...mt, ...data.results]))
  }, [data])

  // updates selected master team and related fields
  useEffect(() => {
    if (values.masterTeam) {
      const mt = masterTeamItems.findIndex(mt => mt.id === values.masterTeam)
      setSelectedMasterTeam(masterTeamItems[mt])

      const teamAdmin = masterTeamItems[mt]?.teamAdmins
      const isValidAdmin = Array.isArray(teamAdmin) && teamAdmin.length > 0
      const adminName = isValidAdmin ? teamAdmin[0]?.firstName ?? '' : ''
      const adminEmail = isValidAdmin ? teamAdmin[0]?.email ?? '' : ''

      setFieldValue('masterTeamAdminName', adminName)
      setFieldValue('masterTeamAdminEmail', adminEmail)
    }
  }, [values.masterTeam, masterTeamItems])

  // fetches newly created master team and updates local master team list
  useEffect(() => {
    const checkMasterTeam = selectedMasterTeam !== null && selectedMasterTeam?.id === values.masterTeam

    if (!values.masterTeam || selectedMasterTeam || checkMasterTeam) return
    const mt = masterTeamItems.findIndex(mt => mt.id === values.masterTeam)

    if (mt < 0 && masterTeamAdded === undefined) {
      masterTeamGet({
        id: values.masterTeam
      })

      return
    }

    if (mt < 0 && masterTeamAdded) {
      const teamAdminFullName = () => {
        if (masterTeamAdded.teamsAdmins?.length) {
          return masterTeamAdded.teamsAdmins[0].fullName
        }

        return masterTeamAdded.teamAdmin?.fullName || ''
      }

      const teamAdminEmail = () => {
        if (masterTeamAdded.teamsAdmins?.length) {
          return masterTeamAdded.teamsAdmins[0].fullName
        }

        return `${masterTeamAdded.teamAdmin?.email} ${masterTeamAdded.teamAdmin?.email}` || ''
      }

      setMasterTeamItems(mt => ([...new Set([
        ...mt,
        {
          id: values.masterTeam!,
          name: masterTeamAdded?.name,
          teamAdminId: '',
          teamAdmin: null,
          teamAdmins: null,
          headCoachId: masterTeamAdded.headCoach.id,
          headCoachFullName: masterTeamAdded.headCoach.fullName,
          headCoachEmail: masterTeamAdded.headCoach.email,
          teamAdminFullName: teamAdminFullName(),
          teamAdminEmail: teamAdminEmail()
        } as IFEMasterTeam
      ])]))
    }
  }, [values.masterTeam, masterTeamItems, selectedMasterTeam, masterTeamAdded])

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
        buttonAction={onAddMasterTeam}
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
