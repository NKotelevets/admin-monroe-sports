import { FilterDropdownProps } from 'antd/es/table/interface'
import { InputRef, TableColumnType } from 'antd'
import FilterDropDown from '@/components/Table/FilterDropDown.tsx'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { useRef } from 'react'



export const useTableSearch = (handleTableReset?: () => void) => {
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = <T,>(
    dataIndex: keyof T,
    onFilter?: (value: boolean | React.Key, record: T) => boolean
  ): TableColumnType<T> => ({
    filterDropdown: (props) => (
      <FilterDropDown {...props} handleReset={handleReset} handleSearch={handleSearch} searchInput={searchInput} />
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1A1657' : '#BDBCC2' }} />,
    onFilter: (value, record) => {
      if (onFilter) {
        return onFilter(value, record)
      }

      return (record[dataIndex] as string)
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const handleReset = (clearFilters: () => void) => {
    handleTableReset && handleTableReset()
    clearFilters()
  }

  return {
    getColumnSearchProps
  }
}
