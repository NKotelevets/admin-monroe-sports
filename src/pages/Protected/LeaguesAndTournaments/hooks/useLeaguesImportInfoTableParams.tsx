import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { TableColumnType } from 'antd'
import Button from 'antd/es/button/button'
import Input, { InputRef } from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { useRef } from 'react'
import { ReactSVG } from 'react-svg'

import ErrorDuplicateTag from '@/components/ErrorDuplicateTag'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { IBECreateLeagueBody, ILeagueImportInfoTableRecord } from '@/common/interfaces/league'
import { TSortOption } from '@/common/types'

import SyncIcon from '@/assets/icons/sync.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof ILeagueImportInfoTableRecord

export const useLeaguesImportInfoTableParams = (
  sortOrder: TSortOption,
  setSelectedIdx: (value: number | null) => void,
) => {
  const [updateRecord] = useUpdateLeagueMutation()
  const { setAppNotification } = useAppSlice()
  const searchInput = useRef<InputRef>(null)
  const { duplicates, removeDuplicate } = useLeagueSlice()

  const handleUpdate = (idx: number) => {
    const currentDuplicate = duplicates.find((duplicate) => duplicate.index === idx)
    const newData = currentDuplicate!.new
    const backendBodyFormat: IBECreateLeagueBody = {
      description: newData.description,
      name: newData.name,
      playoff_format: newData.playoff_format,
      playoffs_teams: newData.playoffs_teams,
      standings_format: newData.standings_format,
      tiebreakers_format: newData.tiebreakers_format,
      type: newData.type,
      welcome_note: newData.welcome_note,
      league_seasons: newData.league_seasons || [],
    }

    updateRecord({ id: newData.id, body: backendBodyFormat })
      .unwrap()
      .then(() => {
        setAppNotification({
          message: 'Successfully update',
          type: 'success',
          timestamp: new Date().getTime(),
        })
        setSelectedIdx(null)
        removeDuplicate(idx)
      })
      .catch(() => setSelectedIdx(null))
  }

  const handleReset = (clearFilters: () => void) => clearFilters()
  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<ILeagueImportInfoTableRecord> => ({
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
      render: (value) => <ErrorDuplicateTag text={value} />,
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
      render: (value) => (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {value}
        </Typography.Text>
      ),
    },
    {
      title: '',
      dataIndex: '',
      width: '50px',
      render: (_, record) =>
        record.type === 'Duplicate' && <ReactSVG src={SyncIcon} onClick={() => handleUpdate(record.idx)} />,
    },
  ]

  return {
    columns,
  }
}
