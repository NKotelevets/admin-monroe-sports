import { DropdownContext } from '@/components/Dropdown/DropdownContext.ts'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick.tsx'
import { IDropdownProps } from '@/components/Dropdown/index.tsx'

interface IDropdownProviderProps extends IDropdownProps {
  children: ReactElement
}

export const DropdownProvider = (props: IDropdownProviderProps) => {
  const {
    children,
    items,
    loading,
    value = null,
    onLoadMore,
    onSearch,
    onValueChange
  } = props

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useOutsideClick(dropdownRef, () => setIsDropdownOpen(false))

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(value)
  const [searchValue, setSearchValue] = useState<string>('')

  // updates parent with current value
  useEffect(() => {
    !!onValueChange && onValueChange(selectedItem)
  }, [selectedItem])

  useEffect(() => {
    if (isDropdownOpen) return

    resetValues()
  }, [isDropdownOpen])

  function resetValues() {
    setSearchValue('')
    setSelectedItem(null)
  }

  // handles infinite scroll
  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement
    if (target.scrollTop + target.clientHeight >= target.scrollHeight && !loading) {
      !!onLoadMore && onLoadMore()
    }
  }, [onLoadMore, loading])

  const onAddTeam = () => {
    // TODO: handle add team button
  }

  return (
    <DropdownContext.Provider value={{
      items,
      loading,
      dropdownRef,
      onScroll,
      onAddTeam,
      selectedItem,
      setSelectedItem,
      searchValue,
      setSearchValue,
      onSearch,
      isDropdownOpen,
      setIsDropdownOpen
    }}>
      {children}
    </DropdownContext.Provider>
  )
}
