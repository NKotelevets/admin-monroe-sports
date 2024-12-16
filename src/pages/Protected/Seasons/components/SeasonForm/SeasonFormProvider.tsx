import { SeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormContext.tsx'
import { ReactElement, useState } from 'react'
import { IFELeague } from '@/common/interfaces/league.ts'

export interface ISeasonFormProviderProps {
  children: ReactElement
}

export const SeasonFormProvider = (props: ISeasonFormProviderProps) => {
  const { children } = props

  const [showBracketPage, setShowBracketPage] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<IFELeague | null>(null)

  return (
    <SeasonFormContext.Provider
      value={{
        showBracketPage,
        setShowBracketPage,
        selectedLeague,
        setSelectedLeague
      }}
    >
      {children}
    </SeasonFormContext.Provider>
  )
}
