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

import TextWithTooltip from '@/components/TextWithTooltip'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import { PATH_TO_EDIT_MASTER_TEAM } from '@/constants/paths'

import { IFELeague } from '@/common/interfaces/league'

import CopyIcon from '@/assets/icons/copy.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IFELeague

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowDeleteSingleRecordModal: (value: boolean) => void
}

const getIconColor = (isFiltered: boolean) => (isFiltered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)')

export const useMasterTeamsTable = ({ setSelectedRecordId, setShowDeleteSingleRecordModal }: IParams) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const { limit, offset, ordering } = useMasterTeamsSlice()
  const [getMasterTeams] = useLazyGetMasterTeamsQuery()
  const { setAppNotification } = useAppSlice()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFELeague> => ({
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
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: getIconColor(filtered) }} />,
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
    getMasterTeams({
      limit,
      offset,
      ordering: ordering || undefined,
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

  const columns: TColumns<IFELeague> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: ordering?.includes('name') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('name'),
      render: (value) => (
        <TextWithTooltip
          maxLength={25}
          text={value}
          onClick={
            () => {}
            // navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)
          }
        />
      ),
    },
    {
      title: 'Team Administrator',
      dataIndex: 'admin',
      sorter: true,
      width: '240px',
      sortOrder: ordering?.includes('admin') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('name'),
      render: (value) => (
        <TextWithTooltip
          maxLength={25}
          text={value}
          onClick={
            () => {}
            // navigate(PATH_TO_USERS + '/' + record.id)
          }
        />
      ),
    },
    {
      title: 'Team Admin Email',
      dataIndex: 'adminEmail',
      width: '240px',
      render: (value) => (
        <Flex align="center" onClick={() => handleCopyContent(value)}>
          <TextWithTooltip maxLength={25} text={value} isRegularText />
          <ReactSVG src={CopyIcon} style={{ marginLeft: '4px' }} />
        </Flex>
      ),
    },

    {
      title: 'Head Coach',
      dataIndex: 'headCoach',
      ...getColumnSearchProps('name'),
      sorter: true,
      width: '240px',
      sortOrder: ordering?.includes('headCoach') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => (
        <TextWithTooltip
          maxLength={25}
          text={value}
          onClick={
            () => {}
            // navigate(PATH_TO_USERS + '/' + record.id)
          }
        />
      ),
    },
    {
      title: 'Coach email',
      dataIndex: 'headCoachEmail',
      width: '240px',
      render: (value) => (
        <Flex align="center" onClick={() => handleCopyContent(value)}>
          <TextWithTooltip maxLength={25} text={value} isRegularText />

          <ReactSVG src={CopyIcon} style={{ marginLeft: '4px' }} />
        </Flex>
      ),
    },

    {
      title: 'Linked Leagues/Tourns',
      dataIndex: 'leagues',
      width: '200px',
      render: (value) => (
        <TextWithTooltip
          maxLength={25}
          text={value}
          onClick={
            () => {}
            // navigate(PATH_TO_USERS + '/' + record.id)
          }
        />
      ),
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
              navigate(PATH_TO_EDIT_MASTER_TEAM + `/${value.id}`)
            }}
          />

          <ReactSVG
            onClick={() => {
              setSelectedRecordId(value.id)
              setShowDeleteSingleRecordModal(true)
            }}
            src={DeleteIcon}
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

