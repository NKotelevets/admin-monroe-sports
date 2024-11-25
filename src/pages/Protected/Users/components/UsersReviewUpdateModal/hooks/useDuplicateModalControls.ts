import { useCallback, useState } from 'react'
import { IFEDuplicateWithIdx } from '@/common/interfaces/user.ts'
import { useUserSlice } from '@/redux/hooks/useUserSlice.ts'

export const useDuplicateModalControls = (idx: number, onClose: () => void) => {
  const { duplicates, removeDuplicate } = useUserSlice()
  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const currentDuplicate = duplicates.find((duplicate) => duplicate.idx === currentIdx)
  const actualIndex = duplicates.indexOf(currentDuplicate as IFEDuplicateWithIdx)

  const handleNext = useCallback(() => (
    setCurrentIdx((prev) => prev + 1)
  ), [])

  const handlePrev = useCallback((
    () => setCurrentIdx((prev) => prev - 1)
  ), [])

  const handleSkip = useCallback(() => {
    if (duplicates.length === 1) {
      onClose()
      removeDuplicate(currentIdx)

      return
    }

    if (actualIndex === duplicates.length - 1) {
      if (duplicates.length === 1) {
        close()
      } else {
        setCurrentIdx(0)
      }
    }

    setTimeout(() => {
      removeDuplicate(currentIdx)
    }, 500)
  }, [currentIdx, duplicates])

  const handleClose = useCallback(() => {
    onClose()
  }, [])

  return {
    currentDuplicate,
    currentIdx,
    actualIndex,
    handleNext,
    handlePrev,
    handleSkip,
    handleClose
  }
}
