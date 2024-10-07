import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { TableColumnType } from 'antd'
import Button from 'antd/es/button'
import Flex from 'antd/es/flex'
import { InputRef } from 'antd/es/input'
import Input from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import MonroeTooltip from '@/components/MonroeTooltip'
import CellText from '@/components/Table/CellText'
import MonroeFilter from '@/components/Table/MonroeFilter'
import MonroeFilterRadio from '@/components/Table/MonroeFilterRadio'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'
import { useLazyGetUsersQuery, useSendInvitationMutation } from '@/redux/user/user.api'

import { PATH_TO_EDIT_USER, PATH_TO_USERS } from '@/constants/paths'

import { SHORT_GENDER_NAMES } from '@/common/constants'
import { IExtendedFEUser } from '@/common/interfaces/user'
import { TGender } from '@/common/types'

import CopyEmailIcon from '@/assets/icons/copy.svg'
import EditIcon from '@/assets/icons/edit.svg'
import SearchEmailIcon from '@/assets/icons/email-search.svg'
import LockIcon from '@/assets/icons/lock.svg'
import UnLockIcon from '@/assets/icons/unlock.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IExtendedFEUser

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowBlockSingleUserModal: (value: boolean) => void
  setShowUnBlockSingleUserModal: (value: boolean) => void
}

const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

export const useUsersTableParams = ({
  setSelectedRecordId,
  setShowBlockSingleUserModal,
  setShowUnBlockSingleUserModal,
}: IParams) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const [getUsers] = useLazyGetUsersQuery()
  const { setAppNotification } = useAppSlice()
  const { ordering } = useUserSlice()
  const [sendInvitation] = useSendInvitationMutation()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IExtendedFEUser> => ({
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
      (record[dataIndex] as string)
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
    await navigator.clipboard.writeText(email)

    setAppNotification({
      message: 'Email successfully copied',
      timestamp: new Date().getTime(),
      type: 'success',
    })
  }

  const columns: TColumns<IExtendedFEUser> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      fixed: 'left',
      width: '146px',
      className: 'hide-right-border',
      ...getColumnSearchProps('firstName'),
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_USERS + '/' + record.id)} />
      ),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      fixed: 'left',
      width: '146px',
      className: 'hide-right-border',
      ...getColumnSearchProps('lastName'),
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
      title: 'Roles',
      dataIndex: 'roles',
      width: '240px',
      render: (_, record) => (
        <TextWithTooltip isRegularText maxLength={28} text={record.roles.length ? record.roles.join(', ') : '-'} />
      ),
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: getIconColor(filtered),
          }}
        />
      ),
      filters: [
        { text: 'Master Admin', value: 'superuser' },
        { text: 'Operator', value: 'operator' },
        { text: 'Team Admin', value: 'team_admin' },
        { text: 'Head Coach', value: 'head_coach' },
        { text: 'Coach', value: 'coach' },
        { text: 'Player', value: 'player' },
        { text: 'Guardian', value: 'supervisor' },
        { text: 'Child', value: 'child' },
      ],
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      width: '240px',
      ...getColumnSearchProps('teams'),
      render: (value) => <TextWithTooltip isRegularText maxLength={28} text={value.length ? value.join(', ') : '-'} />,
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      sorter: true,
      width: '128px',
      sortOrder: ordering ? (ordering.startsWith('-') ? 'descend' : 'ascend') : null,
      render: (value) => <CellText>{value ? format(new Date(value), 'MMM, dd yyyy') : '-'}</CellText>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '192px',
      render: (value, record) => (
        <>
          {value ? (
            <Flex
              style={{
                zIndex: 4,
              }}
              justify="space-between"
            >
              <TextWithTooltip maxLength={14} text={value} />
              <Flex
                style={{
                  marginLeft: '8px',
                }}
                align="center"
              >
                {record.operator && !record.inviteAccepted && (
                  <MonroeTooltip width="auto" text="Resend email to Operator">
                    <ReactSVG
                      src={SearchEmailIcon}
                      onClick={() => {
                        sendInvitation({ emails: [record.email] })
                          .unwrap()
                          .then(() => {
                            setAppNotification({
                              message: `Invitation successfully sended to ${record.email}`,
                              timestamp: new Date().getTime(),
                              type: 'success',
                            })
                          })
                      }}
                    />
                  </MonroeTooltip>
                )}

                <div style={{ marginLeft: '4px' }}>
                  <ReactSVG src={CopyEmailIcon} onClick={() => handleCopyContent(value)} />
                </div>
              </Flex>
            </Flex>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      width: '192px',
      render: (value) => <CellText>{value || '-'}</CellText>,
    },
    {
      title: 'Zip Code',
      dataIndex: 'zipCode',
      width: '192px',
      render: (value) => <CellText>{value || '-'}</CellText>,
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value, record) => {
        const Icon = !record.isActive ? LockIcon : UnLockIcon

        return (
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
              style={{ marginRight: '8px' }}
            />

            <MonroeTooltip
              isHideModalOnIconClick
              text={record.isActive ? 'Block user' : 'Unblock user'}
              containerWidth="auto"
              width="110px"
            >
              <ReactSVG
                onClick={() => {
                  setSelectedRecordId(value.id)

                  if (!record.isActive) {
                    setShowUnBlockSingleUserModal(true)
                  } else {
                    setShowBlockSingleUserModal(true)
                  }
                }}
                src={Icon}
                style={{ marginTop: '4px' }}
              />
            </MonroeTooltip>
          </Flex>
        )
      },
    },
  ]

  return {
    columns,
  }
}

