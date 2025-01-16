import { SeasonFormContext, TSeedOptions } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormContext.tsx'
import { ReactElement, useState } from 'react'
import { IFELeague } from '@/common/interfaces/league.ts'

export interface ISeasonFormProviderProps {
  children: ReactElement
  mustValidate?: boolean
}

export const SeasonFormProvider = (props: ISeasonFormProviderProps) => {
  const { children, mustValidate } = props

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
        getErrorMessage
      }}
    >
      {children}
    </SeasonFormContext.Provider>
  )
}
