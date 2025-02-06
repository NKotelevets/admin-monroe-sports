import { createContext, Dispatch, SetStateAction } from 'react'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { ILocation } from '@/common/interfaces/location.ts'
import { IFEDivision } from '@/common/interfaces/division.ts'

export type TEventTeamName = 'team1Id' | 'team2Id'

export type TEventFormContextProps = {
  addingMasterTeam: boolean
  addingLeagueTeam: boolean
  addingLocation: boolean
  isAddingRelated: boolean

  addedMasterTeam?: string
  addedLeagueTeam?: IFELeagueTeam
  addedLocation?: ILocation

  divisionsAvailable?: IFEDivision[]
  targetField?: TEventTeamName

  setAddingMasterTeam: Dispatch<SetStateAction<boolean>>
  setAddingLeagueTeam: Dispatch<SetStateAction<boolean>>
  setAddingLocation: Dispatch<SetStateAction<boolean>>

  setAddedMasterTeam: Dispatch<SetStateAction<string | undefined>>
  setAddedLeagueTeam: Dispatch<SetStateAction<IFELeagueTeam | undefined>>
  setAddedLocation: Dispatch<SetStateAction<ILocation | undefined>>

  setTargetField: Dispatch<SetStateAction<TEventTeamName | undefined>>
  setDivisionsAvailable: Dispatch<SetStateAction<IFEDivision[] | undefined>>
}

export const EventFormContext = createContext<TEventFormContextProps>({} as TEventFormContextProps)

