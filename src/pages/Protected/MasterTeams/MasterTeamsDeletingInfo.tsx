import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Breadcrumb, Table } from 'antd'
import type { GetProp, InputRef, TableColumnType, TableProps } from 'antd'
import type { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'
import CellText from '@/components/Table/CellText'
import FilterDropDown from '@/components/Table/FilterDropDown'
import TextWithTooltip from '@/components/TextWithTooltip'

import BaseLayout from '@/layouts/BaseLayout'

import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'

import { PATH_TO_MASTER_TEAMS } from '@/common/constants/paths'
import { IMasterTeamError } from '@/common/interfaces/masterTeams'

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_MASTER_TEAMS}>Master Teams</a>,
  },
  {
    title: <MonroeBlueText>Deleting info</MonroeBlueText>,
  },
]

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

type TDataIndex = keyof IMasterTeamError

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IMasterTeamError>['field']
  sortOrder?: SorterResult<IMasterTeamError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const MasterTeamsDeletingInfo = () => {
  const { deletedRecordsErrors } = useMasterTeamsSlice()
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

  const getColumnSearchProps = (
    dataIndex: TDataIndex,
  ): TableColumnType<{
    id: string
    name: string
    error: string
  }> => ({
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

  const columns: TColumns<IMasterTeamError> = [
    {
      title: 'Team Name',
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
        <CellText isLink onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)}>
          {value}
        </CellText>
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      render: (value) => <TextWithTooltip maxLength={100} text={value} />,
    },
  ]

  const handleTableChange: TableProps<{
    id: string
    name: string
    error: string
  }>['onChange'] = (pagination, filters, sorter) => {
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

export default MasterTeamsDeletingInfo

