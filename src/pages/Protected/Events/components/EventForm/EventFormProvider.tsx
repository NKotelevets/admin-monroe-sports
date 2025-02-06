import { ReactElement, useEffect, useState } from 'react'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { EventFormContext, TEventTeamName } from '@/pages/Protected/Events/components/EventForm/EventFormContext.ts'
import { ILocation } from '@/common/interfaces/location.ts'
import { IFEDivision } from '@/common/interfaces/division.ts'

export type TEventFormProviderProps = {
  children: ReactElement
}

export const EventFormProvider = (props: TEventFormProviderProps) => {
  const { children } = props

  const [addingMasterTeam, setAddingMasterTeam] = useState(false)
  const [addingLeagueTeam, setAddingLeagueTeam] = useState(false)
  const [addingLocation, setAddingLocation] = useState(false)

  const [addedMasterTeam, setAddedMasterTeam] = useState<string | undefined>(undefined)
  const [addedLeagueTeam, setAddedLeagueTeam] = useState<IFELeagueTeam | undefined>(undefined)
  const [addedLocation, setAddedLocation] = useState<ILocation | undefined>(undefined)

  const [isAddingRelated, setIsAddingRelated] = useState(false)
  const [targetField, setTargetField] = useState<TEventTeamName | undefined>(undefined)
  const [divisionsAvailable, setDivisionsAvailable] = useState<IFEDivision[] | undefined>(undefined)

  useEffect(() => {
    if (addingMasterTeam || addingLeagueTeam || addingLocation) {
      setIsAddingRelated(true)
    } else {
      setIsAddingRelated(false)
    }
  }, [addingMasterTeam, addingLeagueTeam, addingLocation])

  return (
    <EventFormContext.Provider
      value={{
        addingMasterTeam,
        setAddingMasterTeam,
        addingLeagueTeam,
        setAddingLeagueTeam,
        addingLocation,
        setAddingLocation,
        addedMasterTeam,
        setAddedMasterTeam,
        addedLeagueTeam,
        setAddedLeagueTeam,
        addedLocation,
        setAddedLocation,
        isAddingRelated,
        targetField,
        setTargetField,
        divisionsAvailable,
        setDivisionsAvailable,
      }}
    >
      {children}
    </EventFormContext.Provider>
  )
}
