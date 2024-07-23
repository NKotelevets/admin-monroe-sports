import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Button, GetProp, TableColumnType } from 'antd'
import Flex from 'antd/es/flex'
import Input, { InputRef } from 'antd/es/input/Input'
import Table from 'antd/es/table'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { format } from 'date-fns'
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import MonroeModal from '@/components/MonroeModal'
import MonroeTooltip from '@/components/MonroeTooltip'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useDeleteSeasonMutation, useLazyGetSeasonsQuery } from '@/redux/seasons/seasons.api'

import { PATH_TO_LEAGUE_TOURNAMENT_PAGE, PATH_TO_SEASONS_DETAILS } from '@/constants/paths'

import { IBEDivision } from '@/common/interfaces/division'
import { IFESeason, IGetSeasonsRequestParams } from '@/common/interfaces/season'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

type TColumns<T> = TableProps<T>['columns']
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IFESeason>['field']
  sortOrder?: SorterResult<IFESeason>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
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

const showTotal = (total: number) => (
  <Typography.Text
    style={{
      color: 'rgba(26, 22, 87)',
    }}
  >
    Total {total} items
  </Typography.Text>
)

type TDataIndex = keyof IFESeason

type TTableKeys = 'name' | 'league' | 'startDate' | 'expectedEndDate'

const SeasonsTable: FC<ISeasonsTableTableProps> = ({
  isDeleteAllRecords,
  selectedRecordIds,
  setIsDeleteAllRecords,
  setSelectedRecordsIds,
  setShowAdditionalHeader,
  showAdditionalHeader,
  showCreatedRecords,
}) => {
  const { seasons, limit, offset, ordering, total, createdRecordsNames, setPaginationParams } = useSeasonSlice()
  const [getSeasons, { isLoading, isFetching, data }] = useLazyGetSeasonsQuery()
  const navigate = useNavigate()
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
  const searchInput = useRef<InputRef>(null)

  useEffect(() => {
    getSeasons({
      limit,
      offset,
    })
  }, [])

  const handleReset = (clearFilters: () => void) => clearFilters()
  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFESeason> => ({
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

  const columns: TColumns<IFESeason> = [
    {
      title: 'Season name',
      dataIndex: 'name',
      fixed: 'left',
      width: '20vw',
      sorter: true,
      ...getColumnSearchProps('name'),
      sortOrder: ordering?.includes('name') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value, record) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`${PATH_TO_SEASONS_DETAILS}/${record.id}`)}
        >
          {value}
        </Typography.Text>
      ),
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: 'league',
      onFilter: (value, record) => record.name.startsWith(value as string),
      width: '20vw',
      sorter: true,
      sortOrder: ordering?.includes('league') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('league'),
      render: (value) => (
        <Typography.Text
          style={{
            color: '#3E34CA',
            cursor: 'pointer',
          }}
          onClick={() => navigate(PATH_TO_LEAGUE_TOURNAMENT_PAGE + '/' + value.id)}
        >
          {value.name}
        </Typography.Text>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: '192px',
      sorter: true,
      sortOrder: ordering?.includes('start_date') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {format(new Date(value), 'MMMM dd, yyyy')}
        </Typography.Text>
      ),
    },
    {
      title: 'Expected End Date',
      dataIndex: 'expectedEndDate',
      width: '192px',
      sorter: true,
      sortOrder: ordering?.includes('expected_end_date') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {format(new Date(value), 'MMMM dd, yyyy')}
        </Typography.Text>
      ),
    },
    {
      title: 'Division/Pool',
      dataIndex: 'divisions',
      width: '200px',
      render: (divisions: IBEDivision[], _, idx) => {
        const divisionsNames = divisions.map((division) => division.name).join(', ')
        const divisionsLength = divisionsNames.length

        return (
          <>
            {divisionsLength > 24 ? (
              <MonroeTooltip
                width="120px"
                arrowPosition={idx > (seasons.length - 1) / 2 ? 'bottom' : 'top'}
                text={
                  <Flex vertical>
                    {divisions.map((division) => (
                      <p key={division.id}>{division.name}</p>
                    ))}
                  </Flex>
                }
              >
                <Typography.Text
                  style={{
                    color: 'rgba(62, 52, 202, 1)',
                    fontSize: '14px',
                  }}
                >
                  {divisionsNames.substring(0, 21).trim() + '...'}
                </Typography.Text>
              </MonroeTooltip>
            ) : (
              <Typography.Text
                style={{
                  color: 'rgba(62, 52, 202, 1)',
                  fontSize: '14px',
                }}
              >
                {divisionsNames}
              </Typography.Text>
            )}
          </>
        )
      },
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Flex vertical={false} justify="center" align="center">
            <ReactSVG src={EditIcon} />
            <ReactSVG
              onClick={() => {
                setSelectedRecordId(record.id)
                setShowDeleteSingleRecordModal(true)
              }}
              src={DeleteIcon}
              style={{ marginLeft: '8px' }}
            />
          </Flex>
        )
      },
    },
  ]

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination: {
        ...pagination,
        showTotal,
      },
    })

    const BE_SORTING_FIELDS: Record<TTableKeys, string> = {
      expectedEndDate: 'expected_end_date',
      league: 'league',
      name: 'name',
      startDate: 'start_date',
    }

    const orderingValue = Array.isArray(sorter)
      ? null
      : sorter.order === 'ascend'
        ? `${BE_SORTING_FIELDS[sorter.field as TTableKeys]}`
        : `-${BE_SORTING_FIELDS[sorter.field as TTableKeys]}`

    const getSeasonsRequestParams: IGetSeasonsRequestParams = {
      offset: (pagination?.current && pagination?.current - 1) || 0,
      limit: pagination?.pageSize || 10,
      name: (filters?.['name']?.[0] as string) ?? undefined,
      league__name: (filters?.['league']?.[0] as string) ?? undefined,
      ordering: orderingValue,
    }

    getSeasons(getSeasonsRequestParams)

    setPaginationParams({
      offset: (pagination?.current && pagination?.current - 1) || 0,
      limit: pagination?.pageSize || 10,
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

  return (
    <>
      {showDeleteSingleRecordModal && (
        <MonroeModal
          okText="Delete"
          onCancel={() => setShowDeleteSingleRecordModal(false)}
          onOk={handleDelete}
          title="Delete season?"
          type="warn"
          content={
            <>
              <p>Are you sure you want to delete this season?</p>
            </>
          }
        />
      )}

      {showAdditionalHeader && (
        <div className="leagues-table-header">
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.85)',
              marginRight: '10px',
            }}
          >
            {isDeleteAllRecords
              ? `All ${total} records are selected.`
              : `All ${tableParams.pagination?.pageSize} records on this page are selected.`}
          </p>

          {!isDeleteAllRecords ? (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => setIsDeleteAllRecords(true)}
            >
              Select all {total} records in seasons instead.
            </p>
          ) : (
            <p
              style={{
                color: '#3E34CA',
                fontSize: '14px',
              }}
              onClick={() => {
                setIsDeleteAllRecords(false)
                setSelectedRecordsIds([])
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all records
            </p>
          )}
        </div>
      )}

      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={seasons}
        pagination={tableParams.pagination}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        rowClassName={(record) =>
          showCreatedRecords && createdRecordsNames.includes(record.name) ? 'highlighted-row' : ''
        }
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRecordIds,
          onChange: (selected) => {
            if (selected.length === tableParams.pagination?.pageSize) setShowAdditionalHeader(true)

            if (selected.length !== tableParams.pagination?.pageSize) setShowAdditionalHeader(false)

            if (!isDeleteAllRecords) setSelectedRecordsIds(selected as string[])
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

