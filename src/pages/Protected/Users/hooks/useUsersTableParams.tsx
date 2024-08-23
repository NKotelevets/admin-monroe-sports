import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { TableColumnType } from 'antd'
import Button from 'antd/es/button'
import Flex from 'antd/es/flex'
import { InputRef } from 'antd/es/input'
import Input from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import CellText from '@/components/Table/CellText'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useLazyGetUsersQuery } from '@/redux/user/user.api'

import { PATH_TO_EDIT_USER, PATH_TO_USERS } from '@/constants/paths'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { IFEUser } from '@/common/interfaces/user'
import { TGender } from '@/common/types'

import EditIcon from '@/assets/icons/edit.svg'
import LockIcon from '@/assets/icons/lock.svg'
import UnLockIcon from '@/assets/icons/unlock.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IFEUser

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowDeleteSingleRecordModal: (value: boolean) => void
}

const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

export const useUsersTableParams = ({ setSelectedRecordId, setShowDeleteSingleRecordModal }: IParams) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const Icon = searchInput ? LockIcon : UnLockIcon
  const [getUsers] = useLazyGetUsersQuery()
  const { setAppNotification } = useAppSlice()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFEUser> => ({
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
            onClick={() => {
              clearFilters && handleReset(clearFilters)
              handleSearch(confirm)
            }}
            style={{
              flex: '1 1 auto',
              color: selectedKeys.length ? 'rgba(188, 38, 27, 1)' : 'rgba(189, 188, 194, 1)',
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

  const handleReset = (clearFilters: () => void) => {
    getUsers({
      limit: 10,
      offset: 0,
    })
    clearFilters()
  }

  const handleCopyContent = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)

      setAppNotification({
        message: 'Email successfully copied',
        timestamp: new Date().getTime(),
        type: 'success',
      })
    } catch {
      // TODO: think about this issue
    }
  }

  const columns: TColumns<IFEUser> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      fixed: 'left',
      width: '240px',
      ...getColumnSearchProps('firstName'),
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      fixed: 'left',
      width: '240px',
      ...getColumnSearchProps('lastName'),
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: '',
      dataIndex: 'gender',
      width: '50px',
      filters: [
        { text: 'Male', value: 0 },
        { text: 'Female', value: 1 },
        { text: 'Other', value: 2 },
      ],
      render: (value) => <CellText> {SHORT_GENDER_NAMES[value as TGender]}</CellText>,
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
    },
    {
      title: 'Roles',
      dataIndex: '',
      width: '240px',
      render: () => <TextWithTooltip maxLength={28} text="Player, Coach, Head Coach, Operator" />,
    },
    {
      title: 'Teams',
      dataIndex: '',
      width: '240px',
      render: () => <TextWithTooltip maxLength={28} text="Team 1 name, team 2 name, team 3 name" />,
      ...getColumnSearchProps('firstName'),
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      width: '128px',
      sorter: (a, b) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime(),
      render: (value) => <CellText>{value || '-'}</CellText>,
    },

    {
      title: 'Email',
      dataIndex: 'email',
      width: '192px',
      render: (value) => (
        <div onClick={() => handleCopyContent(value)}>
          <TextWithTooltip maxLength={18} text={value} />
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      width: '192px',
      render: (value) => <CellText>{value || '-'}</CellText>,
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value) => (
        <Flex
          vertical={false}
          justify="center"
          align="center"
          style={{
            cursor: 'pointer',
          }}
        >
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(PATH_TO_EDIT_USER + `/${value.id}`)
            }}
          />

          <ReactSVG
            onClick={() => {
              setSelectedRecordId(value.id)
              setShowDeleteSingleRecordModal(true)
            }}
            src={Icon}
            style={{ marginLeft: '8px' }}
          />
        </Flex>
      ),
    },
  ]

  return {
    columns,
  }
}

