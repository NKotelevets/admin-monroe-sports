import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Button, Flex, TableColumnType, TableProps } from 'antd'
import { InputRef } from 'antd/es/input'
import Input from 'antd/es/input/Input'
import { FilterDropdownProps } from 'antd/es/table/interface'
import Typography from 'antd/es/typography'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import MonroeTooltip from '@/components/MonroeTooltip'
import TextWithTooltip from '@/components/TextWithTooltip'

import { PATH_TO_LEAGUE_TOURNAMENT_PAGE, PATH_TO_SEASONS_DETAILS } from '@/constants/paths'

import { IBEDivision } from '@/common/interfaces/division'
import { IFESeason } from '@/common/interfaces/season'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

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
            onClick={() => clearFilters && handleReset(clearFilters)}
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
      title: 'Season Name',
      dataIndex: 'name',
      fixed: 'left',
      sorter: true,
      ...getColumnSearchProps('name'),
      sortOrder: ordering?.includes('name') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value, record) => (
        <TextWithTooltip
          onClick={() => navigate(`${PATH_TO_SEASONS_DETAILS}/${record.id}`)}
          text={value}
          maxLength={25}
        />
      ),
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: 'league',
      onFilter: (value, record) => record.name.startsWith(value as string),
      sorter: true,
      sortOrder: ordering?.includes('league') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('league'),
      render: (_, record) => (
        <>
          {record.league ? (
            <TextWithTooltip
              onClick={() => navigate(PATH_TO_LEAGUE_TOURNAMENT_PAGE + '/' + record.league.id)}
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
      sorter: true,
      sortOrder: ordering?.includes('start_date') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {format(new Date(value), 'MMMM dd, yyyy')}
        </Typography.Text>
      ),
    },
    {
      title: 'Expected End Date',
      dataIndex: 'expectedEndDate',
      sorter: true,
      sortOrder: ordering?.includes('expected_end_date') ? (!ordering.startsWith('-') ? 'ascend' : 'descend') : null,
      render: (value) => (
        <Typography.Text
          style={{
            color: 'rgba(26, 22, 87, 0.85)',
          }}
        >
          {format(new Date(value), 'MMMM dd, yyyy')}
        </Typography.Text>
      ),
    },
    {
      title: 'Division/Pool',
      dataIndex: 'divisions',
      render: (divisions: IBEDivision[]) => {
        const divisionsNames = divisions.map((division) => division.name).join(', ')
        const divisionsLength = divisionsNames.length

        return (
          <>
            {divisionsLength > 28 ? (
              <MonroeTooltip
                width="auto"
                arrowPosition={divisions.length < 10 ? 'bottom' : 'top'}
                text={
                  <Flex vertical>
                    {divisions.map((division) => (
                      <p key={division.name}>{division.name}</p>
                    ))}
                  </Flex>
                }
              >
                <Typography.Text
                  style={{
                    color: 'rgba(62, 52, 202, 1)',
                    fontSize: '14px',
                  }}
                >
                  {divisionsNames.substring(0, 27) + '...'}
                </Typography.Text>
              </MonroeTooltip>
            ) : (
              <Typography.Text
                style={{
                  color: 'rgba(62, 52, 202, 1)',
                  fontSize: '14px',
                }}
              >
                {divisionsNames}
              </Typography.Text>
            )}
          </>
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
          <Flex
            justify="center"
            align="center"
            style={{
              cursor: 'pointer',
            }}
          >
            <ReactSVG src={EditIcon} />
            <ReactSVG
              onClick={() => {
                setSelectedRecordId(record.id)
                setShowDeleteSingleRecordModal(true)
              }}
              src={DeleteIcon}
              style={{ marginLeft: '8px' }}
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
