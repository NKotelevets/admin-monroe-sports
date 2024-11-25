import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { GetProp, TableColumnType } from 'antd'
import { InputRef } from 'antd/es/input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import FilterDropDown from '@/components/Table/FilterDropDown'
import TextWithTooltip from '@/components/TextWithTooltip'

import { PATH_TO_LEAGUE_PAGE } from '@/common/constants/paths'
import { ILeagueDeletionItemError } from '@/common/interfaces/league'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof ILeagueDeletionItemError

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<ILeagueDeletionItemError>['field']
  sortOrder?: SorterResult<ILeagueDeletionItemError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export const useLeaguesDeletingInfoTableProps = (tableParams: ITableParams) => {
  const searchInput = useRef<InputRef>(null)
  const navigate = useNavigate()

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<ILeagueDeletionItemError> => ({
    filterDropdown: (props) => (
      <FilterDropDown {...props} handleReset={handleReset} handleSearch={handleSearch} searchInput={searchInput} />
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1A1657' : '#BDBCC2' }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const columns: TColumns<ILeagueDeletionItemError> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.name.includes(value as string),
      fixed: 'left',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: tableParams.sortOrder,
      width: '240px',
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + record.id)} />
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      render: (value) => <TextWithTooltip maxLength={80} text={value} />,
    },
  ]

  return {
    columns,
  }
}
