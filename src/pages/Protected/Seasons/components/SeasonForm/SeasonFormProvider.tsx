import { SeasonFormContext, TSeedOptions } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormContext.tsx'
import { ReactElement, useState } from 'react'
import { IFELeague } from '@/common/interfaces/league.ts'
import { IBracket } from '@/common/interfaces/bracket.ts'
import { ICreateSeasonFormValues } from '@/pages/Protected/Seasons/constants/formik.ts'

export interface ISeasonFormProviderProps {
  children: ReactElement
  initialBracketData?: IBracket
  mustValidate?: boolean
}

export const SeasonFormProvider = (props: ISeasonFormProviderProps) => {
  const { children, mustValidate, initialBracketData } = props

  const [data, setData] = useState<ICreateSeasonFormValues | undefined>()
  const [bracketData, setBracketData] = useState<IBracket>(initialBracketData || {} as IBracket)
  const [showBracketPage, setShowBracketPage] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<IFELeague | null>(null)
  const [seedOptionsPerSubdivision, setSeedOptionsPerSubdivision] = useState<TSeedOptions[][]>([])
  const [ids, setIds] = useState<number[]>([])

  const getErrorMessage = (error?: string, touched?: boolean): string => {
    if(mustValidate) {
      return error || ''
    }

    return touched && error ? error : ''
  }

  return (
    <SeasonFormContext.Provider
      value={{
        showBracketPage,
        setShowBracketPage,
        selectedLeague,
        setSelectedLeague,
        ids,
        setIds,
        seedOptionsPerSubdivision,
        setSeedOptionsPerSubdivision,
        getErrorMessage,
        data,
        setData,
        bracketData,
        setBracketData
      }}
    >
      {children}
    </SeasonFormContext.Provider>
  )
}
