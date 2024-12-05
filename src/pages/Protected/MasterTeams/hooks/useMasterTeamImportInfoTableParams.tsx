import { useTableSearch } from '@/hooks/useTableSearch.tsx'
import CellText from '@/components/Table/CellText.tsx'
import { FilterFilled } from '@ant-design/icons'
import { getIconColor } from '@/utils'
import TagType from '@/components/Table/TagType.tsx'
import { ReactSVG } from 'react-svg'
import SyncIcon from '@/assets/icons/sync.svg'
import { GetProp, TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { SorterResult } from 'antd/es/table/interface'
import { IImportMasterTeamCSVTableData } from '@/common/interfaces/masterTeams.ts'
import { IFEDuplicate } from '@/common/interfaces/masterTeams.ts'

interface IParams {
  setSelectedIndex(index: number): void
  records: IFEDuplicate[]
}

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IImportMasterTeamCSVTableData>['field']
  sortOrder?: SorterResult<IImportMasterTeamCSVTableData>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>
type TColumns<T> = TableProps<T>['columns']

/**
 * This hook handles the configuration of importing user csv table and manages its state,
 * including sorting, pagination, and selection of records.

 * @param {Object} params - The parameters for configuring the table.
 * @param {function} params.setSelectedIndex - A function to set the selected index of the record.
 * @param {IImportMasterTeamCSVTableData[]} params.records - An array of records to be displayed in the table.
 *
 * @returns An object containing the following properties:
 *  - {Array} columns - An array of column definitions for the Ant Design table.
 *  - {function} handleTableChange - A function to update the table parameters (e.g., pagination, sorting).
 *  - {Object} tableParams - The current table parameters used for managing table state.
 *
 * @example
 * const { columns, setTableParams, tableParams } = useMasterTeamImportInfoTableParams<TObjectShape>({
 *   setSelectedIndex: (index) => console.log(`Selected index: ${index}`),
 *   records: userData,
 * });
 *
 */
export const useMasterTeamImportInfoTableParams = ({
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

  const handleTableChange: TableProps<IImportMasterTeamCSVTableData>['onChange'] = (pagination) => {
    setTableParams({
      pagination: {
        ...pagination,
      },
    })
  }

  const columns: TColumns<IImportMasterTeamCSVTableData> = [
    {
      title: 'Team Name',
      dataIndex: 'masterTeamName',
      width: '240px',
      sorter: (s1, s2) => s1.masterTeamName.localeCompare(s2.masterTeamName),
      // sortOrder: sortFirstNameOrder,
      ...getColumnSearchProps<IImportMasterTeamCSVTableData>('masterTeamName'),
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
    },
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) =>
        record.status === 'Duplicate' && (
          <ReactSVG className="c-p" src={SyncIcon} onClick={() => setSelectedIndex(record.index)} />
        )
    }
  ]

  return {
    columns,
    handleTableChange,
    tableParams
  }
}
