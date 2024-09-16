import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Button, GetProp, TableColumnType } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb/Breadcrumb'
import Input, { InputRef } from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table/InternalTable'
import Table from 'antd/es/table/Table'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'
import CellText from '@/components/Table/CellText'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TagType from '@/components/Table/TagType'
import TextWithTooltip from '@/components/TextWithTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { PATH_TO_USERS } from '@/constants/paths'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { TGender } from '@/common/types'

interface IBlockedUserError {
  id: string
  firstName: string
  lastName: string
  gender: number
  message: string
}

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

type TDataIndex = keyof IBlockedUserError

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IBlockedUserError>['field']
  sortOrder?: SorterResult<IBlockedUserError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const mockedData: IBlockedUserError[] = [
  {
    id: '123',
    firstName: 'Joe',
    lastName: 'Doe',
    gender: 0,
    message: 'Description error..',
  },
  {
    id: '123456',
    firstName: 'Alex',
    lastName: 'Appleseed',
    gender: 1,
    message: 'Description error..',
  },
  {
    id: '123456789',
    firstName: 'Milan',
    lastName: 'Lastname',
    gender: 1,
    message: 'Description error..',
  },
]

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_USERS}>Users</a>,
  },
  {
    title: <MonroeBlueText>Blocking info</MonroeBlueText>,
  },
]

const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

const BlockingInfo = () => {
  const handleReset = (clearFilters: () => void) => clearFilters()
  const searchInput = useRef<InputRef>(null)
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
    },
  })
  const navigate = useNavigate()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IBlockedUserError> => ({
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

  const columns: TColumns<IBlockedUserError> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.firstName.includes(value as string),
      fixed: 'left',
      width: '240px',
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('firstName'),
      render: (value, record) => (
        <CellText isLink onClick={() => navigate(PATH_TO_USERS + '/' + record.id)}>
          {value}
        </CellText>
      ),
    },
    {
      title: 'Last Name',
      dataIndex: '',
      width: '240px',
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('lastName'),
      render: (_, record) => (
        <CellText isLink onClick={() => navigate(`${PATH_TO_USERS}/${record.id}`)}>
          {record.lastName}
        </CellText>
      ),
    },
    {
      title: '',
      dataIndex: 'gender',
      width: '80px',
      onFilter: (value, record) => value === record.gender,
      render: (value) => <CellText isLink>{SHORT_GENDER_NAMES[value as TGender]}</CellText>,
      filters: [
        { text: 'Male', value: 0 },
        { text: 'Female', value: 1 },
        { text: 'Other', value: 2 },
      ],
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
    },
    {
      title: 'Status',
      width: '132px',
      render: () => <TagType />,
    },
    {
      title: 'Error info',
      dataIndex: 'message',
      render: (value) => <TextWithTooltip maxLength={100} text={value} />,
    },
  ]

  const handleTableChange: TableProps<IBlockedUserError>['onChange'] = (pagination, filters, sorter) => {
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

        <Title>Blocking info</Title>

        <Description>
          This panel provides a summary of blocked users, listing the rows with errors. Click on the user to view the
          details and correct the error that is preventing deletion.
        </Description>

        <Table
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={mockedData}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Container>
    </BaseLayout>
  )
}

export default BlockingInfo

