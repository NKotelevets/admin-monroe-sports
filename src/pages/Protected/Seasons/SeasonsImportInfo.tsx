import { FilterFilled, SearchOutlined } from '@ant-design/icons'
import { Button, GetProp, InputRef, Table, TableColumnType, TableProps } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import Flex from 'antd/es/flex'
import Input from 'antd/es/input/Input'
import Space from 'antd/es/space'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { CSSProperties, useRef, useState } from 'react'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import SeasonsReviewUpdateModal from '@/pages/Protected/Seasons/components/SeasonsReviewUpdateModal'

import MonroeFilter from '@/components/Table/MonroeFilter'

import BaseLayout from '@/layouts/BaseLayout'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { containerStyles, descriptionStyle, titleStyle } from '@/constants/deleting-importing-info.styles'
import { PATH_TO_LEAGUE_PAGE, PATH_TO_SEASONS } from '@/constants/paths'

import { IImportSeasonTableRecord } from '@/common/interfaces/season'
import { TErrorDuplicate, TSortOption } from '@/common/types'

import SyncIcon from '@/assets/icons/sync.svg'

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IImportSeasonTableRecord>['field']
  sortOrder?: SorterResult<IImportSeasonTableRecord>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TDataIndex = keyof IImportSeasonTableRecord

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_SEASONS}>Seasons</a>,
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

const duplicateTagStyles: CSSProperties = {
  border: '1px solid #FFD770',
  backgroundColor: '#FFF9EB',
}

const errorTagStyles: CSSProperties = {
  border: '1px solid #FF594D',
  backgroundColor: '#FFF1F0',
}

const TagType: FC<{ text: TErrorDuplicate }> = ({ text }) => {
  const style = text === 'Duplicate' ? duplicateTagStyles : errorTagStyles

  return (
    <Space
      style={{
        ...style,
        padding: '0 8px',
        borderRadius: '2px',
        fontSize: '12px',
      }}
    >
      <Typography.Text
        style={{
          color: text === 'Duplicate' ? 'rgba(243, 178, 9, 1)' : '#BC261B',
        }}
      >
        {text}
      </Typography.Text>
    </Space>
  )
}

const SeasonsImportInfo = () => {
  const { tableRecords, duplicates } = useSeasonSlice()
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
  const searchInput = useRef<InputRef>(null)
  const [sortSeasonNameOrder, setSortSeasonNameOrder] = useState<TSortOption>(null)
  const [sortLeagueNameOrder, setSortLeagueNameOrder] = useState<TSortOption>(null)
  const navigate = useNavigate()

  const handleUpdate = (idx: number) => {
    const currentDuplicate = duplicates.find((duplicate) => duplicate.index === idx)
    const newData = currentDuplicate!.new // TODO: change fields for request into pascal case
    console.log('>', newData)
    // TODO: add update logic
  }

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IImportSeasonTableRecord> => ({
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

  const handleTableChange: TableProps['onChange'] = (pagination, _, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
    })

    if (!Array.isArray(sorter) && sorter.field === 'name') setSortSeasonNameOrder(sorter.order || null)
    if (!Array.isArray(sorter) && sorter.field === 'leagueName') setSortLeagueNameOrder(sorter.order || null)
  }

  const columns: TColumns<IImportSeasonTableRecord> = [
    {
      title: 'Season name',
      dataIndex: 'name',
      sorter: (s1, s2) => s1.name.localeCompare(s2.name),
      sortOrder: sortSeasonNameOrder,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
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
      ),
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: 'leagueName',
      width: '20vw',
      sortOrder: sortLeagueNameOrder,
      sorter: (s1, s2) => s1.leagueName.localeCompare(s2.leagueName),
      ...getColumnSearchProps('leagueName'),
      render: (value, record) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
            cursor: 'pointer',
          }}
          onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + record.leagueId)}
        >
          {value}
        </Typography.Text>
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
      width: '400px',
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
      width: '80px',
      render: (_, record) =>
        record.type === 'Duplicate' && <ReactSVG src={SyncIcon} onClick={() => handleUpdate(record.idx)} />,
    },
  ]

  return (
    <>
      {selectedIdx !== null && <SeasonsReviewUpdateModal idx={selectedIdx} onClose={() => setSelectedIdx(null)} />}

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

export default SeasonsImportInfo
