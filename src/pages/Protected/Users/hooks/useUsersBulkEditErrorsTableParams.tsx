import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { GetProp, InputRef, TableColumnType } from 'antd'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import CellText from '@/components/Table/CellText'
import FilterDropDown from '@/components/Table/FilterDropDown'
import MonroeFilterRadio from '@/components/Table/MonroeFilterRadio'
import TagType from '@/components/Table/TagType'
import TextWithTooltip from '@/components/TextWithTooltip'

import { getIconColor } from '@/utils'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { PATH_TO_USERS } from '@/common/constants/paths'
import { IBulkEditError } from '@/common/interfaces/user'
import { TGender } from '@/common/types'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IBulkEditError
type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

interface ITableParams {
  pagination?: TTablePaginationConfig
  sortField?: SorterResult<IBulkEditError>['field']
  sortOrder?: SorterResult<IBulkEditError>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export const useUsersBulkEditErrorsTableParams = ({ tableParams }: { tableParams: ITableParams }) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IBulkEditError> => ({
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

  const columns: TColumns<IBulkEditError> = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.first_name.includes(value as string),
      fixed: 'left',
      width: '240px',
      sorter: (a, b) => a.first_name.length - b.first_name.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('first_name'),
      render: (value, record) => {
        return <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      },
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      fixed: 'left',
      width: '240px',
      filterSearch: true,
      filterMode: 'tree',
      sorter: (a, b) => a.first_name.length - b.first_name.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('last_name'),
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: '',
      dataIndex: 'gender',
      width: '80px',
      onFilter: (value, record) => value === record.gender,
      filters: [
        { text: 'Female', value: 0 },
        { text: 'Male', value: 1 },
        { text: 'Other', value: 2 },
      ],
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
      render: (value) => <CellText> {SHORT_GENDER_NAMES[value as TGender]}</CellText>,
      filterDropdown: MonroeFilterRadio,
    },
    {
      title: 'Status',
      width: '132px',
      render: () => <TagType />,
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      render: (value) => (
        <CellText>
          {
            // eslint-disable-next-line no-useless-escape
            /[\[\]]/.test(value) ? JSON.parse(value.replace(/'/g, '"'))[0] : value
          }
        </CellText>
      ),
    },
  ]

  return {
    columns,
  }
}

