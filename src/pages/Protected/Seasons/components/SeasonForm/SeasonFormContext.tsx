import { createContext } from 'react'
import { IFELeague } from '@/common/interfaces/league.ts'

export interface ISeasonFormContextProps {
  showBracketPage: boolean
  selectedLeague: IFELeague | null
  ids: number[]

  setSelectedLeague(value: IFELeague): void

  setShowBracketPage(value: boolean): void

  setIds: React.Dispatch<React.SetStateAction<number[]>>

  getErrorMessage(error?: string, touched?: boolean): string
}

export const SeasonFormContext = createContext<ISeasonFormContextProps>({} as ISeasonFormContextProps)

