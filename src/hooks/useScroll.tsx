import { useRef } from 'react'

const useScroll = (getData: () => Promise<void>) => {
  const ref = useRef<HTMLDivElement>()

  const handleScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current
      const clientScrollHeight = scrollTop + clientHeight

      if (clientScrollHeight >= scrollHeight) getData()
    }
  }

  return { ref, handleScroll }
}

export default useScroll
