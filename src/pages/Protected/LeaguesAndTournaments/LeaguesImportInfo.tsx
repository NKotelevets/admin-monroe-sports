import { GetProp, Table, TableProps } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { SorterResult } from 'antd/es/table/interface'
import { useState } from 'react'

import LeagueReviewUpdateModal from '@/pages/Protected/LeaguesAndTournaments/components/LeagueReviewUpdateModal'
import { useLeaguesImportInfoTableParams } from '@/pages/Protected/LeaguesAndTournaments/hooks/useLeaguesImportInfoTableParams'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'

import BaseLayout from '@/layouts/BaseLayout'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'

import { PATH_TO_LEAGUES } from '@/constants/paths'

import { ILeagueImportInfoTableRecord } from '@/common/interfaces/league'
import { TSortOption } from '@/common/types'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<ILeagueImportInfoTableRecord>['field']
  sortOrder?: SorterResult<ILeagueImportInfoTableRecord>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_LEAGUES}>Leagues & Tournaments</a>,
  },
  {
    title: <MonroeBlueText>Import info</MonroeBlueText>,
  },
]

const ImportInfo = () => {
  const { tableRecords } = useLeagueSlice()
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
  const [sortOrder, setSortOrder] = useState<TSortOption>(null)
  const { columns } = useLeaguesImportInfoTableParams(sortOrder, setSelectedIdx)

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
        <Container>
          <Breadcrumb items={BREADCRUMB_ITEMS} />

          <Title>Import info</Title>

          <Description>
            This panel provides a summary of your CSV import, listing rows with errors and duplicates. Click on any
            duplicate to review details, compare and decide whether to keep existing records or replace them with new
            entries. This helps ensure your data is accurate and up-to-date.
          </Description>

          <Table
            columns={columns}
            rowKey={(record) => record.name}
            dataSource={tableRecords}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Container>
      </BaseLayout>
    </>
  )
}

export default ImportInfo
