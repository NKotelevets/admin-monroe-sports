import { usePageContext } from '@/layouts/Page/context.ts'
import { useFormikContext } from 'formik'
import { useEventFormContext } from '@/pages/Protected/Events/hooks/useEventFormContext.ts'
import { useEffect } from 'react'
import { PATH_TO_EVENTS } from '@/common/constants/paths.ts'
import { MonroeBlueText } from '@/components/Elements'
import { scrollToTop } from '@/utils'
import CreateMasterTeams from '@/pages/Protected/MasterTeams/CreateMasterTeams.tsx'
import LeagueTeamCreate from '@/pages/Protected/LeagueTeams/LeagueTeamCreate.tsx'
import CreateLocation from '@/pages/Protected/Locations/CreateLocation.tsx'
import { useLocation } from 'react-router-dom'

export const RelatedForms = () => {
  const location = useLocation()
  const isEdit = location.pathname.includes('edit')
  const title = isEdit ? 'Edit' : 'Create'

  const { setPageTitle, setBreadcrumbs } = usePageContext()
  const { setFieldValue } = useFormikContext()
  const {
    addingMasterTeam,
    setAddingMasterTeam,
    setAddedMasterTeam,
    addingLeagueTeam,
    setAddingLeagueTeam,
    setAddedLeagueTeam,
    addingLocation,
    setAddingLocation,
    setAddedLocation,
    targetField,
    setTargetField
  } = useEventFormContext()

  const resetAddingValues = () => {
    setAddingMasterTeam(false)
    setAddingLeagueTeam(false)
    setAddingLocation(false)
  }

  useEffect(() => {
    const pageInfo = {
      masterTeams: 'Create master team',
      leagueTeams: 'Create league team',
      locations: 'Create location'
    }

    const currentPage = addingMasterTeam
      ? 'masterTeams'
      : addingLeagueTeam
        ? 'leagueTeams'
        : 'locations'

    setPageTitle(pageInfo[currentPage])
    setBreadcrumbs([
      { title: <a href={PATH_TO_EVENTS}>Events</a> },
      { title: <a onClick={resetAddingValues}>{title} event</a> },
      { title: <MonroeBlueText>{pageInfo[currentPage]}</MonroeBlueText> }
    ])

    scrollToTop()
  }, [addingMasterTeam, addingLeagueTeam, addingLocation, title])

  if (addingMasterTeam) {
    return (
      <CreateMasterTeams
        embedded
        goBack={(teamId) => {
          !!targetField && setFieldValue(targetField, teamId)
          setAddedMasterTeam(undefined)
          setTargetField(undefined)
          setAddingMasterTeam(false)
        }}
      />
    )
  }

  if (addingLeagueTeam) {
    return (
      <LeagueTeamCreate
        embedded
        goBack={(teamId) => {
          !!targetField && setFieldValue(targetField, teamId)
          setAddedLeagueTeam(undefined)
          setTargetField(undefined)
          setAddingLeagueTeam(false)
        }}
      />
    )
  }

  if (addingLocation) {
    return (
      <CreateLocation
        embedded
        goBack={(locationId) => {
          setFieldValue('locationId', locationId)
          setAddedLocation(undefined)
          setTargetField(undefined)
          setAddingLocation(false)
        }}
      />
    )
  }

  return <></>
}
