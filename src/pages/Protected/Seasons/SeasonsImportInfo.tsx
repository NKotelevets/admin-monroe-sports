import { GetProp, Table, TableProps } from 'antd'
import Breadcrumb from 'antd/es/breadcrumb'
import { SorterResult } from 'antd/es/table/interface'
import { useState } from 'react'

import SeasonsReviewUpdateModal from '@/pages/Protected/Seasons/components/SeasonsReviewUpdateModal'
import { useSeasonsImportTable } from '@/pages/Protected/Seasons/hooks/useSeasonsImportInfoTable'

import { MonroeBlueText } from '@/components/Elements'
import { Container, Description, Title } from '@/components/Elements/deletingBlockingInfoElements'

import BaseLayout from '@/layouts/BaseLayout'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import { PATH_TO_SEASONS } from '@/constants/paths'

import { IImportSeasonTableRecord } from '@/common/interfaces/season'
import { TSortOption } from '@/common/types'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IImportSeasonTableRecord>['field']
  sortOrder?: SorterResult<IImportSeasonTableRecord>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const BREADCRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_SEASONS}>Seasons</a>,
  },
  {
    title: <MonroeBlueText>Import info</MonroeBlueText>,
  },
]

const SeasonsImportInfo = () => {
  const { tableRecords } = useSeasonSlice()
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
  const [sortSeasonNameOrder, setSortSeasonNameOrder] = useState<TSortOption>(null)
  const [sortLeagueNameOrder, setSortLeagueNameOrder] = useState<TSortOption>(null)
  const { columns } = useSeasonsImportTable(sortSeasonNameOrder, sortLeagueNameOrder, setSelectedIdx)

  const handleTableChange: TableProps['onChange'] = (pagination, _, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
    })

    if (!Array.isArray(sorter) && sorter.field === 'name') setSortSeasonNameOrder(sorter.order || null)
    if (!Array.isArray(sorter) && sorter.field === 'leagueName') setSortLeagueNameOrder(sorter.order || null)
  }

  return (
    <>
      {selectedIdx !== null && <SeasonsReviewUpdateModal idx={selectedIdx} onClose={() => setSelectedIdx(null)} />}

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
            rowKey={(record) => record.name + Math.random()}
            dataSource={tableRecords}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
          />
        </Container>
      </BaseLayout>
    </>
  )
}

export default SeasonsImportInfo
