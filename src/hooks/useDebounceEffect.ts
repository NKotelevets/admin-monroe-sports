import { useEffect } from 'react'

const DEFAULT_DELAY = 300

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useDebounceEffect = (effect: () => void, deps: any, delay = DEFAULT_DELAY) => {
  useEffect(() => {
    // Set a timeout to delay the effect
    const handler = setTimeout(() => {
      effect()
    }, delay)

    // Cleanup function to reset timeout if dependencies change before delay completes
    return () => clearTimeout(handler)
  }, [...deps, delay]) // Re-run the effect when dependencies or delay change
}

export default useDebounceEffect

