import { useRef } from 'react'

const MISSING_PIXEL = 1

const useScroll = (getData: () => Promise<void>) => {
  const ref = useRef<HTMLDivElement>()

  const handleScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current
      const clientScrollHeight = scrollTop + clientHeight + MISSING_PIXEL

      if (clientScrollHeight >= scrollHeight) getData()
    }
  }

  return { ref, handleScroll }
}

export default useScroll
