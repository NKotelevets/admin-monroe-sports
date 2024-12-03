import React, { createContext } from 'react'

interface IDropdownContextProps {
  items: { label: string, value: string }[]
  loading: boolean
  isDropdownOpen: boolean
  selectedItem: string | null
  searchValue: string
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>

  setSearchValue(value: string): void

  setSelectedItem(value: string | null): void

  setIsDropdownOpen(state: boolean): void

  onSearch?(value: string): void

  onScroll(event: React.UIEvent<HTMLDivElement>): void

  onAddTeam(): void
}

export const DropdownContext = createContext<IDropdownContextProps>({} as IDropdownContextProps)
