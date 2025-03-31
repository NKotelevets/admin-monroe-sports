import { TableProps } from 'antd/es/table/InternalTable'
import { useNavigate } from 'react-router-dom'
import TextWithTooltip from '@/components/TextWithTooltip'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { PATH_TO_USERS } from '@/common/constants/paths'
import { IBulkEditFEUser } from '@/common/interfaces/user'
import { TGender } from '@/common/types'
import { BulkEditRecordRoles } from '@/pages/Protected/Users/components/BulkEditRecordRoles.tsx'
import { useCallback, useMemo } from 'react'

type TColumns<T> = TableProps<T>['columns']


export const useUsersBulkEditTableParams = () => {
  const navigate = useNavigate()

  const renderRecordRoles = useCallback((_: unknown, record: IBulkEditFEUser) => (
    <BulkEditRecordRoles record={record} />
  ), [])

  const columns: TColumns<IBulkEditFEUser> = useMemo(() => (
    [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        fixed: 'left',
        width: '150px',
        className: 'hide-right-border valign-top',
        render: (value, record) => (
          <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
        )
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        fixed: 'left',
        width: '150px',
        className: 'hide-right-border valign-top',
        render: (value, record) => (
          <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
        )
      },
      {
        title: '',
        dataIndex: 'gender',
        fixed: 'left',
        width: '50px',
        className: 'valign-top',
        render: (value) => SHORT_GENDER_NAMES[`${value as TGender}`]
      },
      {
        title: 'Roles',
        dataIndex: 'userRoles',
        width: '540px',
        render: renderRecordRoles
      }
    ]
  ), [])

  return {
    columns
  }
}

