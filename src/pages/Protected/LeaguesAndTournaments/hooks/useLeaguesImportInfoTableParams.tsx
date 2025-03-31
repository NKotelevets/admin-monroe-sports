import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { TableColumnType } from 'antd'
import { InputRef } from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef } from 'react'
import { ReactSVG } from 'react-svg'

import CellText from '@/components/Table/CellText'
import FilterDropDown from '@/components/Table/FilterDropDown'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TagType from '@/components/Table/TagType'
import TextWithTooltip from '@/components/TextWithTooltip'

import { ILeagueImportInfoTableRecord } from '@/common/interfaces/league'
import { TSortOption } from '@/common/types'

import SyncIcon from '@/assets/icons/sync.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof ILeagueImportInfoTableRecord

export const useLeaguesImportInfoTableParams = (
  sortOrder: TSortOption,
  setSelectedIdx: (value: number | null) => void,
) => {
  const searchInput = useRef<InputRef>(null)

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<ILeagueImportInfoTableRecord> => ({
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

  const columns: TColumns<ILeagueImportInfoTableRecord> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value as string),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortOrder,
      width: '240px',
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <TextWithTooltip
          maxLength={25}
          text={value}
          onClick={() => {
            record.type === 'Duplicate' && setSelectedIdx(record.idx)
          }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'type',
      filters: [
        { text: 'Duplicate', value: 'Duplicate' },
        { text: 'Error', value: 'Error' },
      ],
      width: '112px',
      onFilter: (value, record) => value === record.type,
      render: (value) => <TagType text={value} />,
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: filtered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)',
          }}
        />
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'message',
      render: (value) => <CellText>{value}</CellText>,
    },
    {
      title: '',
      dataIndex: '',
      width: '50px',
      render: (_, record) =>
        record.type === 'Duplicate' && (
          <ReactSVG className="c-p" src={SyncIcon} onClick={() => setSelectedIdx(record.idx)} />
        ),
    },
  ]

  return {
    columns,
  }
}
