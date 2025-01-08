import { ReactElement, useState } from 'react'
import { ILocation } from '@/common/interfaces/event.ts'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { EventFormContext } from '@/pages/Protected/Events/components/EventForm/EventFormContext.ts'

export type TEventFormProviderProps = {
  children: ReactElement
}

export const EventFormProvider = (props: TEventFormProviderProps) => {
  const { children } = props

  const [addingMasterTeam, setAddingMasterTeam] = useState(false)
  const [addingLeagueTeam, setAddingLeagueTeam] = useState(false)
  const [addingLocation, setAddingLocation] = useState(false)

  const [addedMasterTeam, setAddedMasterTeam] = useState<IFEMasterTeam | undefined>(undefined)
  const [addedLeagueTeam, setAddedLeagueTeam] = useState<IFELeagueTeam | undefined>(undefined)
  const [addedLocation, setAddedLocation] = useState<ILocation | undefined>(undefined)

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
        setAddedLocation
      }}
    >
      {children}
    </EventFormContext.Provider>
  )
}
