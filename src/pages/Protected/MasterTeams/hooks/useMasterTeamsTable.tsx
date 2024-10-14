import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { TableColumnType } from 'antd'
import Flex from 'antd/es/flex'
import { InputRef } from 'antd/es/input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import FilterDropDown from '@/components/Table/FilterDropDown'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useAppSlice } from '@/redux/hooks/useAppSlice'
import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import { getIconColor } from '@/utils'

import { PATH_TO_EDIT_MASTER_TEAM, PATH_TO_MASTER_TEAMS, PATH_TO_USERS } from '@/common/constants/paths'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams'

import CopyIcon from '@/assets/icons/copy.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IFEMasterTeam

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowDeleteSingleRecordModal: (value: boolean) => void
}

export const useMasterTeamsTable = ({ setSelectedRecordId, setShowDeleteSingleRecordModal }: IParams) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const { limit, offset, ordering } = useMasterTeamsSlice()
  const [getMasterTeams] = useLazyGetMasterTeamsQuery()
  const { setAppNotification } = useAppSlice()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const handleReset = (clearFilters: () => void) => {
    getMasterTeams({
      limit,
      offset,
      ordering: ordering || undefined,
    })
    clearFilters()
  }

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFEMasterTeam> => ({
    filterDropdown: (props) => (
      <FilterDropDown {...props} handleReset={handleReset} handleSearch={handleSearch} searchInput={searchInput} />
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: getIconColor(filtered) }} />,
    onFilter: (value, record) =>
      (record[dataIndex] || '')
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100)
    },
  })

  const handleCopyContent = async (email: string) => {
    await navigator.clipboard.writeText(email)

    setAppNotification({
      message: 'Email successfully copied',
      timestamp: new Date().getTime(),
      type: 'success',
    })
  }

  const columns: TColumns<IFEMasterTeam> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: ordering?.includes('name') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('name'),
      render: (_, record) => (
        <TextWithTooltip
          maxLength={22}
          text={record.name}
          onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)}
        />
      ),
    },
    {
      title: 'Team Administrator',
      dataIndex: 'teamAdminFullName',
      width: '240px',
      ...getColumnSearchProps('teamAdminFullName'),
      sortOrder: ordering?.includes('first_team_admin_first_name')
        ? !ordering.startsWith('-')
          ? 'ascend'
          : 'descend'
        : null,
      sorter: true,
      render: (_, record) => (
        <>
          {record.teamAdminFullName ? (
            <TextWithTooltip
              maxLength={22}
              text={record.teamAdminFullName}
              onClick={() => navigate(PATH_TO_USERS + '/' + record.teamAdminId)}
            />
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Team Admin Email',
      dataIndex: 'teamAdminEmail',
      width: '240px',
      render: (_, record) => (
        <>
          {record.teamAdminEmail ? (
            <Flex
              align="center"
              justify="space-between"
              onClick={() => handleCopyContent(record.teamAdminEmail as string)}
            >
              <TextWithTooltip maxLength={21} text={record.teamAdminEmail} isRegularText />
              <ReactSVG className="c-p mg-l4" src={CopyIcon} />
            </Flex>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Head Coach',
      dataIndex: 'headCoachFullName',
      width: '240px',
      ...getColumnSearchProps('headCoachFullName'),
      sortOrder: ordering?.includes('head_coach_first_name')
        ? !ordering.startsWith('-')
          ? 'ascend'
          : 'descend'
        : null,
      sorter: true,
      render: (_, record) => (
        <>
          {record.headCoachFullName ? (
            <TextWithTooltip
              maxLength={22}
              text={record.headCoachFullName}
              onClick={() => navigate(PATH_TO_USERS + '/' + record.headCoachId)}
            />
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Coach email',
      dataIndex: 'headCoachEmail',
      width: '240px',
      render: (_, record) => (
        <>
          {record.headCoachEmail ? (
            <Flex
              align="center"
              justify="space-between"
              onClick={() => handleCopyContent(record.headCoachEmail as string)}
            >
              <TextWithTooltip maxLength={21} text={record.headCoachEmail} isRegularText />
              <ReactSVG className="c-p mg-l4" src={CopyIcon} />
            </Flex>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Linked Leagues/Tourns',
      dataIndex: 'leagues',
      width: '240px',
      ...getColumnSearchProps('leagues'),
      sorter: true,
      sortOrder: ordering?.includes('leagues') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (_, record) => (
        <TextWithTooltip
          maxLength={22}
          text={record.leagues.map((l) => l.name).join(', ') || '-'}
          onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)}
        />
      ),
    },

    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value) => (
        <Flex className="c-p" justify="center" align="center">
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(PATH_TO_EDIT_MASTER_TEAM + `/${value.id}`)
            }}
          />

          <ReactSVG
            className="mg-l8"
            onClick={() => {
              setSelectedRecordId(value.id)
              setShowDeleteSingleRecordModal(true)
            }}
            src={DeleteIcon}
          />
        </Flex>
      ),
    },
  ]

  return {
    columns,
  }
}

