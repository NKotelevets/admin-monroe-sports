import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import { TableProps } from 'antd/es/table/InternalTable'
import { useNavigate } from 'react-router-dom'

import CellText from '@/components/Table/CellText'
import MonroeFilterRadio from '@/components/Table/MonroeFilterRadio'
import TextWithTooltip from '@/components/TextWithTooltip'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { PATH_TO_USERS } from '@/common/constants/paths'
import { IBulkEditError } from '@/common/interfaces/user'
import { TGender } from '@/common/types'

type TColumns<T> = TableProps<T>['columns']

const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

export const useUsersBulkEditErrorsTableParams = () => {
  const navigate = useNavigate()

  const columns: TColumns<IBulkEditError> = [
    {
      title: 'First Name',
      dataIndex: 'first_name',
      fixed: 'left',
      width: '240px',
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      fixed: 'left',
      width: '240px',
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: '',
      dataIndex: 'gender',
      fixed: 'left',
      width: '50px',
      filters: [
        { text: 'Female', value: 0 },
        { text: 'Male', value: 1 },
        { text: 'Other', value: 2 },
      ],
      render: (value) => <CellText> {SHORT_GENDER_NAMES[value as TGender]}</CellText>,
      filterDropdown: MonroeFilterRadio,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'error',
      render: (value) => <CellText>{value}</CellText>,
    },
  ]

  return {
    columns,
  }
}

