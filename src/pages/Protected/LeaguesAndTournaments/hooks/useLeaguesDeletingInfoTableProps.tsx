import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Button, GetProp, TableColumnType } from 'antd'
import { InputRef } from 'antd/es/input'
import Input from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import TextWithTooltip from '@/components/TextWithTooltip'

import { PATH_TO_LEAGUE_TOURNAMENT_PAGE } from '@/constants/paths'

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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Search name"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            style={{
              marginRight: '8px',
              flex: '1 1 auto',
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            style={{
              flex: '1 1 auto',
              color: selectedKeys.length ? 'rgba(188, 38, 27, 1)' : 'rgba(189, 188, 194, 1)',
            }}
          >
            Reset
          </Button>
        </div>
      </div>
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
        <TextWithTooltip
          maxLength={25}
          text={value}
          onClick={() => navigate(PATH_TO_LEAGUE_TOURNAMENT_PAGE + '/' + record.id)}
        />
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

