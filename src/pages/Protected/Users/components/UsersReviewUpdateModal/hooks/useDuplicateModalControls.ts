import { useCallback, useState } from 'react'

interface IProps<T> {
  duplicates: T[]
  idx: number

  removeDuplicateByIndex(index: number): void

  onClose?(): void
}

export const useDuplicateModalControls = <T extends { idx: number }, >(props: IProps<T>) => {
  const { duplicates, idx, removeDuplicateByIndex, onClose } = props

  const [currentIdx, setCurrentIdx] = useState<number>(idx)
  const currentDuplicate = duplicates.find((duplicate) => duplicate.idx === currentIdx)
  const actualIndex = duplicates.indexOf(currentDuplicate as T)

  const handleNext = useCallback(() => (
    setCurrentIdx((prev) => prev + 1)
  ), [])

  const handlePrev = useCallback((
    () => setCurrentIdx((prev) => prev - 1)
  ), [])

  const handleSkip = useCallback(() => {
    if (duplicates.length === 1) {
      !!onClose && onClose()
      removeDuplicateByIndex(currentIdx)

      return
    }

    if (currentIdx === duplicates.length - 1) {
      if (duplicates.length === 1) {
        close()
      } else {
        setCurrentIdx(0)
      }
    }

    removeDuplicateByIndex(currentIdx)
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
