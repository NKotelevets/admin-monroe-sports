import { TColumns } from '@/common/types'
import CellText from '@/components/Table/CellText.tsx'
import TagType from '@/components/Table/TagType.tsx'
import { useNavigate } from 'react-router-dom'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'
import { useState } from 'react'
import { IDeletingError, ITableParams } from '@/common/interfaces'

interface IProps {
  pathToObject: string
  objectColumnTitle: string
}

export const useDeletingInfoTable = (props: IProps) => {
  const navigate = useNavigate()
  const { objectColumnTitle, pathToObject } = props
  const { getColumnSearchProps } = useTableSearch()

  const [tableParams, setTableParams] = useState<ITableParams<IDeletingError>>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: [5, 10, 30, 50],
      showQuickJumper: true,
      showSizeChanger: true
    }
  })

  const columns: TColumns<IDeletingError> = [
    {
      title: objectColumnTitle,
      dataIndex: 'name',
      filterSearch: true,
      filterMode: 'tree',
      onFilter: (value, record) => record.name.includes(value as string),
      fixed: 'left',
      width: '240px',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: tableParams.sortOrder,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <CellText isLink onClick={() => navigate(pathToObject + '/' + record.id)}>
          {value}
        </CellText>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '132px',
      render: (value) => <TagType text={value} />
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      render: (value) => <CellText>{value}</CellText>
    }
  ]

  return {
    columns,
    tableParams,
    setTableParams
  }
}
