import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Button, Flex, TableColumnType, TableProps } from 'antd'
import { InputRef } from 'antd/es/input'
import Input from 'antd/es/input/Input'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import MonroeTooltip from '@/components/MonroeTooltip'
import CellText from '@/components/Table/CellText'
import TextWithTooltip from '@/components/TextWithTooltip'

import { PATH_TO_EDIT_SEASON, PATH_TO_LEAGUE_PAGE, PATH_TO_SEASON_DETAILS } from '@/constants/paths'

import { IBEDivision } from '@/common/interfaces/division'
import { IFESeason } from '@/common/interfaces/season'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'
import WarningIcon from '@/assets/icons/small-warn.svg'

type TDataIndex = keyof IFESeason
type TColumns<T> = TableProps<T>['columns']

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowDeleteSingleRecordModal: (value: boolean) => void
  ordering: string | null
}

export const useSeasonTableParams = ({ ordering, setSelectedRecordId, setShowDeleteSingleRecordModal }: IParams) => {
  const searchInput = useRef<InputRef>(null)
  const handleReset = (clearFilters: () => void) => clearFilters()
  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()
  const navigate = useNavigate()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFESeason> => ({
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
      dataIndex === 'league'
        ? (record['league']?.name || '')
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        : record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const columns: TColumns<IFESeason> = [
    {
      title: 'Season name',
      dataIndex: 'name',
      fixed: 'left',
      width: '240px',
      sorter: true,
      ...getColumnSearchProps('name'),
      sortOrder: ordering?.includes('name') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value, record) => {
        const showIcon = record.divisions.flatMap((d) => d.sub_division.filter((s) => !!s.changed)).length

        return (
          <Flex align="center" justify="flex-start">
            {!!showIcon && (
              <div style={{ marginRight: '8px' }}>
                <MonroeTooltip text="Season requires brackets setting." width="130px" containerWidth="auto">
                  <ReactSVG src={WarningIcon} />
                </MonroeTooltip>
              </div>
            )}

            <TextWithTooltip
              onClick={() => navigate(`${PATH_TO_SEASON_DETAILS}/${record.id}`)}
              text={value}
              maxLength={25}
            />
          </Flex>
        )
      },
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: 'league',
      onFilter: (value, record) => record.name.startsWith(value as string),
      width: '240px',
      sorter: true,
      sortOrder: ordering?.includes('league') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('league'),
      render: (_, record) => (
        <>
          {record.league ? (
            <TextWithTooltip
              onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + record.league.id)}
              text={record.league.name}
              maxLength={25}
            />
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: '192px',
      sorter: true,
      sortOrder: ordering?.includes('start_date') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => <CellText> {format(new Date(value), 'MMMM dd, yyyy')}</CellText>,
    },
    {
      title: 'Expected End Date',
      dataIndex: 'expectedEndDate',
      width: '192px',
      sorter: true,
      sortOrder: ordering?.includes('expected_end_date') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => <CellText>{format(new Date(value), 'MMMM dd, yyyy')}</CellText>,
    },
    {
      title: 'Division/Pool',
      dataIndex: 'divisions',
      width: '200px',
      render: (divisions: IBEDivision[], record) => {
        const divisionsNames = divisions.map((division) => division.name).join(', ')
        const divisionsLength = divisionsNames.length

        return (
          <div style={{ maxWidth: '150px' }} onClick={() => navigate(`${PATH_TO_SEASON_DETAILS}/${record.id}`)}>
            {divisionsLength > 20 ? (
              <MonroeTooltip
                width="150px"
                containerWidth="auto"
                height="140px"
                text={
                  <Flex vertical>
                    {divisions.map((division) => (
                      <p key={division.name}>{division.name}</p>
                    ))}
                  </Flex>
                }
              >
                <CellText isLink>{divisionsNames.substring(0, 16).trim() + '...'}</CellText>
              </MonroeTooltip>
            ) : (
              <CellText isLink>{divisionsNames}</CellText>
            )}
          </div>
        )
      },
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Flex vertical={false} justify="center" align="center">
            <ReactSVG
              src={EditIcon}
              onClick={() => navigate(`${PATH_TO_EDIT_SEASON}/${record.id}`)}
              style={{
                cursor: 'pointer',
              }}
            />
            <ReactSVG
              onClick={() => {
                setSelectedRecordId(record.id)
                setShowDeleteSingleRecordModal(true)
              }}
              src={DeleteIcon}
              style={{ marginLeft: '8px', cursor: 'pointer' }}
            />
          </Flex>
        )
      },
    },
  ]

  return {
    columns,
  }
}
