import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormikContext } from 'formik'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice.tsx'
import { useLazyGetMasterTeamQuery } from '@/redux/masterTeams/masterTeams.api.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import Select from '@/components/Inputs/Select.tsx'
import { ILeagueForm } from '@/common/interfaces/league.ts'
import { useMasterTeamPaginated } from '@/pages/Protected/MasterTeams/hooks/useMasterTeamPaginated.ts'

interface IMasterTeamDropdownProps {
  onAddMasterTeam(): void
  setAddingMasterTeam(state: boolean): void
}

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
export const MasterTeamDropdown = React.memo((props: IMasterTeamDropdownProps) => {
  const { onAddMasterTeam } = props

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue
  } = useFormikContext<ILeagueForm>()

  const { total } = useMasterTeamsSlice()
  const { masterTeamItems, addItem, isFetching, isLoading, loadMore } = useMasterTeamPaginated()

  const [masterTeamGet, { data: masterTeamAdded, isLoading: isLoadingSingle }] = useLazyGetMasterTeamQuery()
  const [selectedMasterTeam, setSelectedMasterTeam] = useState<IFEMasterTeam | null>(null)

  /**
   * Updates selected master team and related fields
   */
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

  /**
   * Fetches master team by id (when editing) and created master
   * team inside this flow (by hitting "add master team" button)
   */
  useEffect(() => {
    const checkMasterTeam = selectedMasterTeam !== null && selectedMasterTeam?.id === values.masterTeam

    if (!values.masterTeam || selectedMasterTeam || checkMasterTeam || isLoadingSingle) return
    const mt = masterTeamItems.findIndex(mt => mt.id === values.masterTeam)

    if (mt < 0 && masterTeamAdded === undefined) {
      masterTeamGet({ id: values.masterTeam })
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
          return masterTeamAdded.teamsAdmins[0].email
        }
        return masterTeamAdded.teamAdmin?.email || ''
      }

      addItem({
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
      } as IFEMasterTeam)
    }
  }, [values.masterTeam, masterTeamItems, selectedMasterTeam, masterTeamAdded, isLoadingSingle])

  /**
   * Holds value if list has reached the end
   */
  const endReached = useMemo(() => (
    masterTeamItems.length >= total
  ), [masterTeamItems, total])

  /**
   * Triggers loadMore from hook if end is not reached yet
   */
  const onLoadMore = useCallback(() => {
    !endReached && loadMore()
  }, [endReached])

  return (
    <>
      <Select
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
          <Select
            disabled
            label="Master Team Administrator *"
            placeholder="Select master team"
            optionFilterProp="label"
            value={values.masterTeamAdminName}
            onChange={handleChange('masterTeamAdminName')}
            error={touched.masterTeamAdminName ? errors.masterTeamAdminName as string : ''}
            options={[
              { label: selectedMasterTeam.teamAdminFullName || 'No admin', value: selectedMasterTeam.teamAdminId }
            ]}
            onBlur={handleBlur('masterTeamAdminName')}
          />
          <Select
            disabled
            label="Master Team Admin Email "
            placeholder="Select master team"
            value={values.masterTeamAdminEmail}
            onChange={handleChange('masterTeamAdminEmail')}
            error={touched.masterTeamAdminEmail ? errors.masterTeamAdminEmail as string : ''}
            options={[
              { label: selectedMasterTeam.teamAdminEmail || 'No email', value: values.masterTeamAdminEmail }
            ]}
            onBlur={handleBlur('masterTeamAdminEmail')}
          />
        </>
      )}
    </>
  )
}, (prev, next) => (
  prev.onAddMasterTeam === next.onAddMasterTeam
  && prev.setAddingMasterTeam === next.setAddingMasterTeam
))
