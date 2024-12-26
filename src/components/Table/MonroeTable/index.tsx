import Table from 'antd/es/table'
import { ReactElement, useEffect, useState } from 'react'
import { ColumnGroupType, ColumnType, SorterResult } from 'antd/es/table/interface'
import { GetProp } from 'antd'
import { TableProps } from 'antd/es/table/InternalTable'
import { ExpandedHeaderLeftText, ExpandedTableHeader, MonroeBlueText, MonroeLightBlueText } from '@/components/Elements'
import { useTableContext } from '@/hooks/useTableContext.ts'

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams<T> {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<T>['field']
  sortOrder?: SorterResult<T>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TMonroeTableProps<T> = {
  showCreated: boolean
  createdIds: string[]
  pagination?: {
    offset: number
    limit: number
    total: number
  }
  onChange: TableProps<T>['onChange']
  columns: (ColumnGroupType<T> | ColumnType<T>)[]
} & Omit<TableProps, 'columns' | 'onChange'>

/**
 * MonroeTable Component
 *
 * A customizable and enhanced table component built on top of Ant Design's `Table` component,
 * with additional features such as highlighting newly created rows and supporting custom pagination settings.
 *
 * @template T - The type of data used in the table rows.
 *
 * @param {TMonroeTableProps} props - Props passed to the MonroeTable component.
 * @param {boolean} props.showCreated - Indicates whether to highlight rows based on `createdIds`.
 * @param {string[]} props.createdIds - An array of IDs for rows that should be highlighted, typically representing newly created records.
 * @param {object} [props.pagination] - An optional object specifying custom pagination settings.
 * @param {number} props.pagination.offset - The current offset for paginated data.
 * @param {number} props.pagination.limit - The number of items to display per page.
 * @param {number} props.pagination.total - The total number of items available.
 * @param {TableProps} rest - Any other props supported by Ant Design's `Table` component, allowing for further customization.
 *
 * @returns {ReactElement} A styled Ant Design `Table` component with additional functionality.
 *
 * @example
 * <MonroeTable<TableType>
 *   showCreated={true}
 *   createdIds={['1', '2']}
 *   pagination={{ offset: 0, limit: 10, total: 100 }}
 *   dataSource={data}
 *   columns={columns}
 * />
 */
export const MonroeTable = <T extends object, >(props: TMonroeTableProps<T>): ReactElement => {
  const {
    onChange,
    showCreated,
    createdIds,
    pagination,
    columns,
    ...rest
  } = props

  const {
    selectedIds,
    setSelectedIds,
    isAllSelected,
    showAdditionalHeader,
    setIsAllSelected,
    setShowAdditionalHeader,
    isLoading
  } = useTableContext()

  const [tableParams, setTableParams] = useState<ITableParams<T>>({})

  useEffect(() => {
    !!pagination && setTableParams({
      pagination: {
        current: pagination.offset / pagination.limit + 1,
        pageSize: pagination.limit,
        pageSizeOptions: [5, 10, 30, 50],
        showQuickJumper: true,
        showSizeChanger: true,
        total: pagination.total,
        showTotal
      }
    })
  }, [pagination])

  return (
    <>
      {showAdditionalHeader && pagination && (
        <ExpandedTableHeader>
          <ExpandedHeaderLeftText>
            {isAllSelected
              ? `All ${pagination.total} master teams are selected.`
              : `All ${pagination.limit} master teams on this page are selected.`}
          </ExpandedHeaderLeftText>

          {!isAllSelected ? (
            <MonroeLightBlueText onClick={() => setIsAllSelected(true)}>
              Select all {pagination.total} master teams instead.
            </MonroeLightBlueText>
          ) : (
            <MonroeLightBlueText
              onClick={() => {
                setSelectedIds([])
                setIsAllSelected(false)
                setShowAdditionalHeader(false)
              }}
            >
              Unselect all league teams
            </MonroeLightBlueText>
          )}
        </ExpandedTableHeader>
      )}

      <Table
        columns={columns}
        loading={isLoading}
        rowKey={(record) => record.id}
        pagination={pagination ? tableParams.pagination : undefined}
        rowClassName={(record) => showCreated && createdIds.find((id) => {return id === record.id })
          ? 'highlighted-row' : ''
        }
        scroll={{
          x: 'scroll'
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (selected) => {
            if (selected.length === pagination?.limit) setShowAdditionalHeader(true)
            if (selected.length < (pagination?.limit || 0)) setShowAdditionalHeader(false)
            setSelectedIds(selected as string[])
          }
        }}
        onChange={onChange as TableProps['onChange']}
        {...rest}
      />
    </>
  )
}

const showTotal = (total: number) => <MonroeBlueText>Total {total} items</MonroeBlueText>
