import { createContext } from 'react'
import { IFELeague } from '@/common/interfaces/league.ts'

export interface ISeasonFormContextProps {
  showBracketPage: boolean
  selectedLeague: IFELeague | null

  setSelectedLeague(value: IFELeague): void
  setShowBracketPage(value: boolean): void
}

export const SeasonFormContext = createContext<ISeasonFormContextProps>({} as ISeasonFormContextProps)

