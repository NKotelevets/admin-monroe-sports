import { Breadcrumb, Flex, Table } from 'antd'
import type { GetProp, TableProps } from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { useState } from 'react'

import { useLeaguesDeletingInfoTableProps } from '@/pages/Protected/LeaguesAndTournaments/hooks/useLeaguesDeletingInfoTableProps'

import BaseLayout from '@/layouts/BaseLayout'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'

import { containerStyles, descriptionStyle, titleStyle } from '@/constants/deleting-importing-info.styles'
import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import { ILeagueDeletionItemError } from '@/common/interfaces/league'

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE}>League & Tourn</a>,
  },
  {
    title: (
      <Typography.Text
        style={{
          color: 'rgba(26, 22, 87, 0.85)',
        }}
      >
        Deleting info
      </Typography.Text>
    ),
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

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })
  }

  return (
    <BaseLayout>
      <Flex style={containerStyles} vertical>
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        <Typography.Title level={1} style={titleStyle}>
          Deleting info
        </Typography.Title>

        <Typography.Text style={descriptionStyle}>
          This panel provides a summary of deleted leagues/tournaments, listing the rows with errors. Click on the error
          to view the details and correct the error that is preventing deletion.
        </Typography.Text>

        <Table
          columns={columns}
          rowKey={(record) => record.name}
          dataSource={deletedRecordsErrors}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Flex>
    </BaseLayout>
  )
}

export default LeaguesDeletingInfo
