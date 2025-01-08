import { createContext, Dispatch, SetStateAction } from 'react'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams.ts'
import { ILocation } from '@/common/interfaces/event.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'

export type TEventFormContextProps = {
  addingMasterTeam: boolean
  addingLeagueTeam: boolean
  addingLocation: boolean

  addedMasterTeam?: IFEMasterTeam
  addedLeagueTeam?: IFELeagueTeam
  addedLocation?: ILocation

  setAddingMasterTeam: Dispatch<SetStateAction<boolean>>
  setAddingLeagueTeam: Dispatch<SetStateAction<boolean>>
  setAddingLocation: Dispatch<SetStateAction<boolean>>

  setAddedMasterTeam: Dispatch<SetStateAction<IFEMasterTeam | undefined>>
  setAddedLeagueTeam: Dispatch<SetStateAction<IFELeagueTeam | undefined>>
  setAddedLocation: Dispatch<SetStateAction<ILocation | undefined>>
}

export const EventFormContext = createContext<TEventFormContextProps>({} as TEventFormContextProps)

