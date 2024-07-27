import { FilterFilled, SearchOutlined } from '@ant-design/icons'
import { Button, GetProp, InputRef, Table, TableColumnType, TableProps, Tooltip } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import Input from 'antd/es/input/Input'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { useRef, useState } from 'react'
import { ReactSVG } from 'react-svg'

import LeagueReviewUpdateModal from '@/pages/Protected/LeaguesAndTournaments/components/LeagueReviewUpdateModal'

import ErrorDuplicateTag from '@/components/ErrorDuplicateTag'
import MonroeFilter from '@/components/Table/MonroeFilter'

import BaseLayout from '@/layouts/BaseLayout'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useUpdateLeagueMutation } from '@/redux/leagues/leagues.api'

import { containerStyles, descriptionStyle, titleStyle } from '@/constants/deleting-importing-info.styles'
import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import { IBECreateLeagueBody } from '@/common/interfaces/league'

import SyncIcon from '@/assets/icons/sync.svg'

interface ILeagueImportInfoTableRecord {
  name: string
  message: string
  type: 'Error' | 'Duplicate'
  idx: number
}

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<ILeagueImportInfoTableRecord>['field']
  sortOrder?: SorterResult<ILeagueImportInfoTableRecord>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TDataIndex = keyof ILeagueImportInfoTableRecord

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE}>Leagues & Tournaments</a>,
  },
  {
    title: (
      <Typography.Text
        style={{
          color: 'rgba(26, 22, 87, 0.85)',
        }}
      >
        Import info
      </Typography.Text>
    ),
  },
]

const ImportInfo = () => {
  const { tableRecords, duplicates, removeDuplicate } = useLeagueSlice()
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: tableRecords.length,
    },
  })
  const [updateRecord] = useUpdateLeagueMutation()
  const { setAppNotification } = useAppSlice()
  const searchInput = useRef<InputRef>(null)
  const [sortOrder, setSortOrder] = useState<'descend' | 'ascend' | null>(null)

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
        <>
          {value?.length > 25 ? (
            <Tooltip
              title={value}
              placement="top"
              color="rgba(62, 62, 72, 0.75)"
              style={{
                width: '250px',
              }}
            >
              <Typography.Text
                style={{
                  color: '#3E34CA',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  record.type === 'Duplicate' && setSelectedIdx(record.idx)
                }}
              >
                {value.substring(0, 23).trim() + '...'}
              </Typography.Text>
            </Tooltip>
          ) : (
            <Typography.Text
              style={{
                color: '#3E34CA',
                cursor: 'pointer',
              }}
              onClick={() => {
                record.type === 'Duplicate' && setSelectedIdx(record.idx)
              }}
            >
              {value}
            </Typography.Text>
          )}
        </>
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

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    setSortOrder(Array.isArray(sorter) ? null : sorter.order || null)
  }

  return (
    <>
      {selectedIdx !== null && <LeagueReviewUpdateModal idx={selectedIdx} onClose={() => setSelectedIdx(null)} />}

      <BaseLayout>
        <Flex style={containerStyles} vertical>
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          <Typography.Title level={1} style={titleStyle}>
            Import info
          </Typography.Title>

          <Typography.Text style={descriptionStyle}>
            This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
            duplicate to review details, compare and decide whether to keep existing records or replace them with new
            entries. This helps ensure your data is accurate and up-to-date.
          </Typography.Text>

          <Table
            columns={columns}
            rowKey={(record) => record.name}
            dataSource={tableRecords}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Flex>
      </BaseLayout>
    </>
  )
}

export default ImportInfo
