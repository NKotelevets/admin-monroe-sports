import React, { createContext } from 'react'

/**
 * Interface defining the structure of the dropdown context properties.
 */
interface IDropdownContextProps {
  /**
   * List of dropdown items. Each item has a label, value, and optional disabled state.
   */
  items: { label: string, value: string, disabled?: boolean }[]

  /**
   * Indicates whether the dropdown is in a loading state.
   */
  loading: boolean

  /**
   * State indicating whether the dropdown is currently open.
   */
  isDropdownOpen: boolean

  /**
   * The currently selected item in the dropdown. Can be null if no item is selected.
   */
  selectedItem: string | null

  /**
   * The current value of the search input field.
   */
  searchValue: string

  /**
   * Ref to the dropdown container element.
   */
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>

  /**
   * Sets the value of the search input.
   * @param value - The new value for the search input.
   */
  setSearchValue(value: string): void

  /**
   * Sets the selected item in the dropdown.
   * @param value - The value of the item to select, or null to clear the selection.
   */
  setSelectedItem(value: string | null): void

  /**
   * Toggles the open state of the dropdown.
   * @param state - The new open state of the dropdown.
   */
  setIsDropdownOpen(state: boolean): void

  /**
   * Optional callback invoked when the search input value changes.
   * @param value - The updated search value.
   */
  onSearch?(value: string): void

  /**
   * Callback invoked when the dropdown container is scrolled.
   * @param event - The scroll event object.
   */
  onScroll(event: React.UIEvent<HTMLDivElement>): void

  /**
   * Callback invoked when a search or selection is submitted.
   * @param value - The value being submitted.
   */
  onSubmit(value: string): void

  /**
   * Optional callback invoked to load more items, typically during infinite scrolling.
   */
  onLoadMore?(): void
}

/**
 * React context for managing dropdown state and behavior.
 * Provides properties and methods to control dropdown interactions.
 */
export const DropdownContext = createContext<IDropdownContextProps>({} as IDropdownContextProps)
