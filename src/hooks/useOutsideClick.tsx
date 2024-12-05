import { useEffect, RefObject } from 'react'

/**
 * Custom hook to handle clicks outside a specified element.
 *
 * @param ref - A React ref object pointing to the element to detect outside clicks.
 * @param callback - A function to call when a click outside the element is detected.
 * @example
 * const ref = useRef(null);
 * useOutsideClick(ref, () => console.log("Clicked outside!"));
 */
export const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}
