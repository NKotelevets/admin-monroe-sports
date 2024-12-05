import { useCallback, useState } from 'react'

export interface IDuplicateModalControlsProps<T> {
  duplicates: T[]
  idx: number

  removeDuplicateByIndex?(index: number, next?: number | null): void

  onClose?(): void
}

export const useDuplicateModalControls = <T extends { idx: number }, >(props: IDuplicateModalControlsProps<T>) => {
  const { duplicates, idx, removeDuplicateByIndex: removeDuplicate, onClose } = props

  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const currentDuplicate = duplicates.find((duplicate) => duplicate.idx === currentIdx)
  const actualIndex = duplicates.indexOf(currentDuplicate as T)

  const handleNext = useCallback(() => (
    setCurrentIdx((prev) => prev + 1)
  ), [])

  const handlePrev = useCallback((
    () => setCurrentIdx((prev) => prev - 1)
  ), [])

  const removeDuplicateByIndex = (index: number, next?: number | null) => {
    !!removeDuplicate && removeDuplicate(index, next)
  }

  const handleSkip = useCallback(() => {
    if (duplicates.length === 1) {
      !!onClose && onClose()
      removeDuplicateByIndex(currentIdx, null)
      return
    }

    if (currentIdx === duplicates.length - 1) {
      if (duplicates.length === 1) {
        close()
        removeDuplicateByIndex(currentIdx, null)
        return
      }

      setCurrentIdx(0)
      removeDuplicateByIndex(currentIdx, 0)
      return
    }

    removeDuplicateByIndex(currentIdx, currentIdx)
  }, [currentIdx, duplicates])

  const handleClose = useCallback(() => {
    !!onClose && onClose()
  }, [])

  return {
    actualIndex,
    currentDuplicate,
    currentIdx,
    handleNext,
    handlePrev,
    handleSkip,
    handleClose
  }
}
