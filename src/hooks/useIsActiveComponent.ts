import { useEffect, useRef, useState } from 'react'

const useIsActiveComponent = (initialIsVisible: boolean) => {
  const [isComponentVisible, setIsComponentVisible] =
    useState<boolean>(initialIsVisible)
  const ref = useRef(null)

  const onClose = () => {
    setIsComponentVisible(false)
  }

  const onOpen = () => {
    setIsComponentVisible(true)
  }

  const handleClickOutside = (event: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ref.current && !(ref.current as any)?.contains(event.target)) {
      setIsComponentVisible(false)
    } else {
      setIsComponentVisible(true)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return { ref, isComponentVisible, onClose, onOpen }
}

export default useIsActiveComponent
