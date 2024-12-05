import { DropdownContext } from '@/components/Dropdown/DropdownContext.ts'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick.tsx'
import { IDropdownProps } from '@/components/Dropdown/index.tsx'

/**
 * Props for the `DropdownProvider` component, extending dropdown properties
 * while excluding `buttonTitle`.
 */
interface IDropdownProviderProps extends Omit<IDropdownProps, 'buttonTitle'> {
  /**
   * The child components to be rendered within the dropdown provider.
   */
  children: ReactElement
}

/**
 * Provides context and state management for dropdown components.
 * Handles dropdown state, search functionality, selection, and event callbacks.
 *
 * @param props - Properties for configuring the dropdown provider.
 * @returns The context provider wrapping child components.
 */
export const DropdownProvider = (props: IDropdownProviderProps) => {
  const {
    children,
    items,
    loading,
    value = null,
    onLoadMore,
    onSearch,
    onValueChange,
    onSubmit
  } = props

  // Reference to the dropdown container element
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside of it
  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false))

  // Dropdown open/close state
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

  // Currently selected item in the dropdown
  const [selectedItem, setSelectedItem] = useState<string | null>(value)

  // Search input value
  const [searchValue, setSearchValue] = useState<string>('')

  /**
   * Effect to update the parent component whenever the selected item changes.
   */
  useEffect(() => {
    !!onValueChange && onValueChange(selectedItem)
  }, [selectedItem])

  /**
   * Effect to reset search and selection values when the dropdown is closed.
   */
  useEffect(() => {
    if (isDropdownOpen) return
    resetValues()
  }, [isDropdownOpen])

  /**
   * Resets the search input and selected item values.
   */
  function resetValues() {
    setSearchValue('')
    setSelectedItem(null)
  }

  /**
   * Handles the infinite scroll functionality.
   * Triggers the `onLoadMore` callback when the user scrolls to the bottom.
   *
   * @param event - The scroll event object.
   */
  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    if (target.scrollTop + target.clientHeight >= target.scrollHeight && !loading) {
      !!onLoadMore && onLoadMore()
    }
  }, [onLoadMore, loading])

  /**
   * Handles the submission of a value.
   * Closes the dropdown after submitting the value.
   *
   * @param value - The value to submit.
   */
  const onSubmitAction = (value: string) => {
    onSubmit(value)
    setIsDropdownOpen(false)
  }

  return (
    <DropdownContext.Provider value={{
      items,
      loading,
      dropdownRef,
      onScroll,
      onSubmit: onSubmitAction,
      selectedItem,
      setSelectedItem,
      searchValue,
      setSearchValue,
      onSearch,
      isDropdownOpen,
      setIsDropdownOpen,
      onLoadMore
    }}>
      {children}
    </DropdownContext.Provider>
  )
}
