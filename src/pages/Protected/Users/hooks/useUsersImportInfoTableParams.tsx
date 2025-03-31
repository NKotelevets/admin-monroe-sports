import { useTableSearch } from '@/hooks/useTableSearch.tsx'
import { IImportUsersCSVTableData } from '@/common/interfaces/user.ts'
import CellText from '@/components/Table/CellText.tsx'
import { SHORT_GENDER_NAMES } from '@/common/constants'
import { TGender } from '@/common/types'
import MonroeFilter from '@/components/Table/MonroeFilter.tsx'
import { FilterFilled } from '@ant-design/icons'
import { getIconColor } from '@/utils'
import TagType from '@/components/Table/TagType.tsx'
import TextWithTooltip from '@/components/TextWithTooltip.tsx'
import { ReactSVG } from 'react-svg'
import SyncIcon from '@/assets/icons/sync.svg'
import { GetProp, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { SorterResult } from 'antd/es/table/interface'

interface IParams {
  setSelectedIndex(idx: number): void
  records: IImportUsersCSVTableData[]
}

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IImportUsersCSVTableData>['field']
  sortOrder?: SorterResult<IImportUsersCSVTableData>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
type TColumns<T> = TableProps<T>['columns']

/**
 * This hook handles the configuration of importing user csv table and manages its state,
 * including sorting, pagination, and selection of records.

 * @param {Object} params - The parameters for configuring the table.
 * @param {function} params.setSelectedIndex - A function to set the selected index of the record.
 * @param {IImportUsersCSVTableData[]} params.records - An array of records to be displayed in the table.
 *
 * @returns An object containing the following properties:
 *  - {Array} columns - An array of column definitions for the Ant Design table.
 *  - {function} handleTableChange - A function to update the table parameters (e.g., pagination, sorting).
 *  - {Object} tableParams - The current table parameters used for managing table state.
 *
 * @example
 * const { columns, setTableParams, tableParams } = useUsersImportInfoTableParams<TObjectShape>({
 *   setSelectedIdx: (idx) => console.log(`Selected index: ${idx}`),
 *   records: userData,
 * });
 *
 */
export const useUsersImportInfoTableParams = ({
  setSelectedIndex,
  records,
}: IParams) => {
  const { getColumnSearchProps } = useTableSearch()

  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true,
      total: records.length,
    },
  })

  // updates pagination
  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: records.length,
      },
    })
  }, [records])

  const handleTableChange: TableProps<IImportUsersCSVTableData>['onChange'] = (pagination) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
    })
  }

  const columns: TColumns<IImportUsersCSVTableData> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      width: '240px',
      sorter: (s1, s2) => s1.firstName.localeCompare(s2.firstName),
      // sortOrder: sortFirstNameOrder,
      ...getColumnSearchProps<IImportUsersCSVTableData>('firstName'),
      render: (value, record) => (
        <CellText
          isLink
          onClick={() => {
            record.status === 'Duplicate' && setSelectedIndex(record.idx)
          }}
        >
          {value}
        </CellText>
      )
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      width: '240px',
      // sortOrder: sortLastNameOrder,
      sorter: (s1, s2) => s1.lastName.localeCompare(s2.lastName),
      ...getColumnSearchProps('lastName'),
      render: (value, record) => (
        <CellText
          isLink
          onClick={() => {
            record.status === 'Duplicate' && setSelectedIndex(record.idx)
          }}
        >
          {value}
        </CellText>
      )
    },
    {
      title: '',
      dataIndex: 'gender',
      width: '80px',
      onFilter: (value, record) => value === record.gender,
      render: (value) => <CellText> {SHORT_GENDER_NAMES[value as TGender]}</CellText>,
      filters: [
        { text: 'Female', value: 0 },
        { text: 'Male', value: 1 },
        { text: 'Other', value: 2 },
      ],
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered)
          }}
        />
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '132px',
      filters: [
        { text: 'Duplicate', value: 'Duplicate' },
        { text: 'Error', value: 'Error' }
      ],
      onFilter: (value, record) => value === record.status,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered)
          }}
        />
      ),
      render: (value) => <TagType text={value} />
    },
    {
      title: 'Error info',
      dataIndex: 'message',
      render: (value) => <TextWithTooltip maxLength={100} text={value} />
    },
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) =>
        record.status === 'Duplicate' && (
          <ReactSVG className="c-p" src={SyncIcon} onClick={() => setSelectedIndex(record.idx)} />
        )
    }
  ]

  return {
    columns,
    handleTableChange,
    tableParams
  }
}
