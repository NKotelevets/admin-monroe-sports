import { createContext } from 'react'
import { IFELeague } from '@/common/interfaces/league.ts'
import { IBracket } from '@/common/interfaces/bracket.ts'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'

export type TSeedOptions = {
  value: number
  label: number
  selected: boolean
}

export interface ISeasonFormContextProps {
  showBracketPage: boolean
  selectedLeague: IFELeague | null
  seedOptionsPerSubdivision: TSeedOptions[][]
  ids: number[]
  data?: ICreateSeasonFormValues
  bracketData: IBracket

  setSelectedLeague(value: IFELeague): void

  setShowBracketPage(value: boolean): void

  setSeedOptionsPerSubdivision: React.Dispatch<React.SetStateAction<TSeedOptions[][]>>

  setIds: React.Dispatch<React.SetStateAction<number[]>>

  setData: React.Dispatch<React.SetStateAction<ICreateSeasonFormValues | undefined>>

  setBracketData: React.Dispatch<React.SetStateAction<IBracket>>

  getErrorMessage(error?: string, touched?: boolean): string
}

export const SeasonFormContext = createContext<ISeasonFormContextProps>({} as ISeasonFormContextProps)

