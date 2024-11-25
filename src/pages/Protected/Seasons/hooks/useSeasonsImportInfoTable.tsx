import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { InputRef, TableColumnType } from 'antd'
import { TableProps } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { MonroeBlueText } from '@/components/Elements'
import CellText from '@/components/Table/CellText'
import FilterDropDown from '@/components/Table/FilterDropDown'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TagType from '@/components/Table/TagType'

import { PATH_TO_LEAGUE_PAGE } from '@/common/constants/paths'
import { IImportSeasonTableRecord } from '@/common/interfaces/season'
import { TSortOption } from '@/common/types'

import SyncIcon from '@/assets/icons/sync.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IImportSeasonTableRecord

export const useSeasonsImportTable = (
  sortSeasonNameOrder: TSortOption,
  sortLeagueNameOrder: TSortOption,
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IImportSeasonTableRecord> => ({
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

  const columns: TColumns<IImportSeasonTableRecord> = [
    {
      title: 'Season name',
      dataIndex: 'name',
      width: '240px',
      sorter: (s1, s2) => s1.name.localeCompare(s2.name),
      sortOrder: sortSeasonNameOrder,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <CellText
          isLink
          onClick={() => {
            record.type === 'Duplicate' && setSelectedIdx(record.idx)
          }}
        >
          {value}
        </CellText>
      ),
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: 'leagueName',
      width: '240px',

      sortOrder: sortLeagueNameOrder,
      sorter: (s1, s2) => s1.leagueName.localeCompare(s2.leagueName),
      ...getColumnSearchProps('leagueName'),
      render: (value, record) => (
        <CellText isLink onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + record.leagueId)}>
          {value}
        </CellText>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'type',
      filters: [
        { text: 'Duplicate', value: 'Duplicate' },
        { text: 'Error', value: 'Error' },
      ],
      width: '132px',
      onFilter: (value, record) => value === record.type,
      render: (_, record) => <TagType text={record.type} />,
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
      render: (value) => <MonroeBlueText>{value}</MonroeBlueText>,
    },
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) =>
        record.type === 'Duplicate' && (
          <ReactSVG className="c-p" src={SyncIcon} onClick={() => setSelectedIdx(record.idx)} />
        ),
    },
  ]

  return { columns }
}

