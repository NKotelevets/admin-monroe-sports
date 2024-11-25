import { useCallback, useState } from 'react'

interface IModalControls {
  index: number

  handleNext(): void

  handlePrev(): void

  handleClose(): void
}

/**
 * Custom hook that manages modal navigation and closure functionality.
 *
 * @param {number} idx - The initial index of the modal, representing the starting item or step.
 * @param {() => void} onClose - Callback function to execute when the modal is closed.
 *
 * @returns {IModalControls} Controls for navigating through modal items and closing the modal.
 * @returns {number} return.index - Current index of the modal.
 * @returns {() => void} return.handleNext - Function to increment the index by one, moving to the next item.
 * @returns {() => void} return.handlePrev - Function to decrement the index by one, moving to the previous item.
 * @returns {() => void} return.handleClose - Function to trigger the onClose callback to close the modal.
 *
 * @example
 * const { index, handleNext, handlePrev, handleClose } = useModalControls(0, () => setShowModal(false))
 */
export const useModalControls = (idx: number, onClose: () => void): IModalControls => {
  const [index, setIndex] = useState<number>(idx)

  const handleNext = useCallback(() => (
    setIndex((prev) => prev + 1)
  ), [])

  const handlePrev = useCallback((
    () => setIndex((prev) => prev - 1)
  ), [])

  const handleClose = useCallback(() => {
    onClose()
  }, [])

  return {
    index,
    handleNext,
    handlePrev,
    handleClose
  }
}
