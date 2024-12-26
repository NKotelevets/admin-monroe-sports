import { useContext } from 'react'
import { SeasonFormContext } from '@/pages/Protected/Seasons/components/SeasonForm/SeasonFormContext.tsx'

export const useSeasonFormContext = () => {
  const context = useContext(SeasonFormContext)

  if (!context) {
    throw new Error('useSeasonFormContext must be used inside a SeasonFormContext!')
  }

  return context
}
