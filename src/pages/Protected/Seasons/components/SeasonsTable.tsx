import { GetProp } from 'antd'
import Table from 'antd/es/table'
import { TableProps } from 'antd/es/table/InternalTable'
import { SorterResult } from 'antd/es/table/interface'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useSeasonTableParams } from '@/pages/Protected/Seasons/hooks/useSeasonTableParams'

import { ExpandedHeaderLeftText, ExpandedTableHeader, MonroeBlueText, MonroeLightBlueText } from '@/components/Elements'
import MonroeModal from '@/components/MonroeModal'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useDeleteSeasonMutation, useLazyGetSeasonsQuery } from '@/redux/seasons/seasons.api'

import { IFESeason, IGetSeasonsRequestParams } from '@/common/interfaces/season'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFESeason>['field']
  sortOrder?: SorterResult<IFESeason>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const showTotal = (total: number) => <MonroeBlueText>Total {total} items</MonroeBlueText>

type TTableKeys = 'name' | 'league' | 'startDate' | 'expectedEndDate'

const BE_SORTING_FIELDS: Record<TTableKeys, string> = {
  expectedEndDate: 'expected_end_date',
  league: 'league',
  name: 'name',
  startDate: 'start_date',
}

interface ISeasonsTableTableProps {
  setSelectedRecordsIds: Dispatch<SetStateAction<string[]>>
  selectedRecordIds: string[]
  showAdditionalHeader: boolean
  setShowAdditionalHeader: Dispatch<SetStateAction<boolean>>
  isDeleteAllRecords: boolean
  setIsDeleteAllRecords: Dispatch<SetStateAction<boolean>>
  showCreatedRecords: boolean
}

const SeasonsTable: FC<ISeasonsTableTableProps> = ({
  isDeleteAllRecords,
  selectedRecordIds,
  setIsDeleteAllRecords,
  setSelectedRecordsIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  showCreatedRecords,
}) => {
  const {
    seasons,
    limit,
    offset,
    ordering,
    total,
    createdRecordsNames,
    setPaginationParams,
    isShowImportWarningModal,
    hideImportWarningModal,
  } = useSeasonSlice()
  const [getSeasons, { isLoading, isFetching, data }] = useLazyGetSeasonsQuery()
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: offset + 1,
      pageSize: limit,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: total,
      showTotal,
    },
  })
  const [deleteSeason] = useDeleteSeasonMutation()
  const [showDeleteSingleRecordModal, setShowDeleteSingleRecordModal] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState('')
  const { columns } = useSeasonTableParams({
    ordering,
    setSelectedRecordId,
    setShowDeleteSingleRecordModal,
  })

  useEffect(() => {
    getSeasons({
      limit,
      offset,
    })
  }, [])

  useEffect(() => {
    if (data?.count) {
      setTableParams((params) => ({
        pagination: {
          ...params.pagination,
          total: data.count,
          showTotal,
        },
      }))
    }

    if (isDeleteAllRecords && data?.seasons.length) {
      const recordIds = data?.seasons.map((s) => s.id)
      setSelectedRecordsIds((prev) => [...prev, ...recordIds])
    }
  }, [data])

  const handleTableChange: TableProps<IFESeason>['onChange'] = (pagination, filters, sorter) => {
    const newOffset = (pagination?.current && (pagination?.current - 1) * (pagination?.pageSize || 10)) || 0
    const newLimit = pagination?.pageSize || 10
    setTableParams({
      pagination: {
        ...pagination,
        showTotal,
      },
    })

    if (!isDeleteAllRecords) {
      setSelectedRecordsIds([])
      setShowAdditionalHeader(false)
    }

    const orderingValue = Array.isArray(sorter)
      ? null
      : sorter.order
        ? sorter.order === 'ascend'
          ? `${BE_SORTING_FIELDS[sorter.field as TTableKeys]}`
          : `-${BE_SORTING_FIELDS[sorter.field as TTableKeys]}`
        : null

    const getSeasonsRequestParams: IGetSeasonsRequestParams = {
      offset: newOffset,
      limit: newLimit,
      name: (filters?.['name']?.[0] as string) ?? undefined,
      league_name: (filters?.['league']?.[0] as string) ?? undefined,
      ordering: orderingValue?.includes('league')
        ? Array.isArray(sorter)
          ? null
          : sorter.order === 'ascend'
            ? 'league__name'
            : '-league__name'
        : orderingValue,
    }

    getSeasons(getSeasonsRequestParams)

    setPaginationParams({
      offset: newOffset,
      limit: newLimit,
      ordering: orderingValue,
    })
  }

  const handleDelete = () =>
    deleteSeason({
      id: selectedRecordId,
    })
      .unwrap()
      .then(() => {
        setShowDeleteSingleRecordModal(false)
        setSelectedRecordId('')
      })
      .catch(() => setShowDeleteSingleRecordModal(false))

  return (
    <>
      {showDeleteSingleRecordModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteSingleRecordModal(false)}
          onOk={handleDelete}
          title="Delete season?"
          type="warn"
          content={<p>Are you sure you want to delete this season?</p>}
        />
      )}

      {isShowImportWarningModal && (
        <MonroeModal
          okText="Confirm"
          onOk={() => hideImportWarningModal()}
          title="Further Bracket editing required"
          type="warn"
          closable={false}
          content={
            <div>
              <p>
                You are importing a file that contains at least one Subdivision with Playoff Format set as “Single
                Elimination Bracket”.
              </p>

              <p>
                If you’re <span className="fw-600 mg-v20">updating a record</span>, only the Playoff change will be
                discarded and will have to be done manually through the Edit Season screen.
              </p>

              <p>
                If you’re <span className="fw-600">adding a new record</span>, it will be created with the Playoff
                Format set as “Best Record Win“. Changing and adding brackets can be done through the corresponding Edit
                Season screen.
              </p>
            </div>
          }
        />
      )}

      {showAdditionalHeader && (
        <ExpandedTableHeader>
          <ExpandedHeaderLeftText>
            {isDeleteAllRecords
              ? `All ${total} records are selected.`
              : `All ${tableParams.pagination?.pageSize} records on this page are selected.`}
          </ExpandedHeaderLeftText>

          {!isDeleteAllRecords ? (
            <MonroeLightBlueText onClick={() => setIsDeleteAllRecords(true)}>
              Select all {total} records in seasons instead.
            </MonroeLightBlueText>
          ) : (
            <MonroeLightBlueText
              onClick={() => {
                setIsDeleteAllRecords(false)
                setSelectedRecordsIds([])
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all records
            </MonroeLightBlueText>
          )}
        </ExpandedTableHeader>
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={seasons}
        pagination={tableParams.pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        rowClassName={(record) =>
          showCreatedRecords && createdRecordsNames.find((cRN) => cRN.name === record.name) ? 'highlighted-row' : ''
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRecordIds,
          onChange: (selected) => {
            if (isDeleteAllRecords) return
            if (selected.length === limit) setShowAdditionalHeader(true)
            if (selected.length < limit) setShowAdditionalHeader(false)
            setSelectedRecordsIds(selected as string[])
            if (!selected.length && showAdditionalHeader && isDeleteAllRecords) setIsDeleteAllRecords(false)
          },
        }}
        scroll={{
          x: 1000,
        }}
      />
    </>
  )
}

export default SeasonsTable
