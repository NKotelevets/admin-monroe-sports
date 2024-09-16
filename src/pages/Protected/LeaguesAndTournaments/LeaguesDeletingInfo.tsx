import { Breadcrumb, Table } from 'antd'
import type { GetProp, TableProps } from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import { useState } from 'react'

import { useLeaguesDeletingInfoTableProps } from '@/pages/Protected/LeaguesAndTournaments/hooks/useLeaguesDeletingInfoTableProps'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'

import BaseLayout from '@/layouts/BaseLayout'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'

import { PATH_TO_LEAGUES } from '@/constants/paths'

import { ILeagueDeletionItemError } from '@/common/interfaces/league'

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_LEAGUES}>League & Tourn</a>,
  },
  {
    title: <MonroeBlueText>Deleting info</MonroeBlueText>,
  },
]

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<ILeagueDeletionItemError>['field']
  sortOrder?: SorterResult<ILeagueDeletionItemError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const LeaguesDeletingInfo = () => {
  const { deletedRecordsErrors } = useLeagueSlice()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
    },
  })
  const { columns } = useLeaguesDeletingInfoTableProps(tableParams)

  const handleTableChange: TableProps<ILeagueDeletionItemError>['onChange'] = (pagination, filters, sorter) => {
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
          This panel provides a summary of deleted leagues/tournaments, listing the rows with errors. Click on the error
          to view the details and correct the error that is preventing deletion.
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

export default LeaguesDeletingInfo
