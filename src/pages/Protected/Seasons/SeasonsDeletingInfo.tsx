import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Breadcrumb, Button, Table } from 'antd'
import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import Input from 'antd/es/input/Input'
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'
import CellText from '@/components/Table/CellText'
import TextWithTooltip from '@/components/TextWithTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { PATH_TO_LEAGUE_PAGE, PATH_TO_SEASONS, PATH_TO_SEASON_DETAILS } from '@/constants/paths'

import { IDeletionSeasonItemError } from '@/common/interfaces/season'

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_SEASONS}>Seasons</a>,
  },
  {
    title: <MonroeBlueText>Deleting info</MonroeBlueText>,
  },
]

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

type TDataIndex = keyof IDeletionSeasonItemError

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IDeletionSeasonItemError>['field']
  sortOrder?: SorterResult<IDeletionSeasonItemError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const SeasonsDeletingInfo = () => {
  const { deletedRecordsErrors } = useSeasonSlice()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
    },
  })
  const searchInput = useRef<InputRef>(null)
  const navigate = useNavigate()

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IDeletionSeasonItemError> => ({
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
            onClick={() => {
              clearFilters && handleReset(clearFilters)
              handleSearch(confirm)
            }}
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

  const columns: TColumns<IDeletionSeasonItemError> = [
    {
      title: 'Season name',
      dataIndex: 'name',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.name.includes(value as string),
      fixed: 'left',
      width: '240px',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <CellText isLink onClick={() => navigate(PATH_TO_SEASON_DETAILS + '/' + record.id)}>
          {value}
        </CellText>
      ),
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: '',
      filterSearch: true,
      filterMode: 'tree',
      width: '240px',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('league'),
      render: (_, record) => (
        <CellText isLink onClick={() => navigate(`${PATH_TO_LEAGUE_PAGE}/${record.league.id}`)}>
          {record.league.name}
        </CellText>
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      render: (value) => <TextWithTooltip maxLength={100} text={value} />,
    },
  ]

  const handleTableChange: TableProps<IDeletionSeasonItemError>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })
  }

  return (
    <BaseLayout>
      <Container>
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        <Title>Deleting info</Title>

        <Description>
          This panel provides a summary of deleted seasons, listing the rows with errors. Click on the error to view the
          details and correct the error that is preventing deletion.
        </Description>

        <Table
          columns={columns}
          rowKey={(record) => record.name}
          dataSource={deletedRecordsErrors}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Container>
    </BaseLayout>
  )
}

export default SeasonsDeletingInfo
