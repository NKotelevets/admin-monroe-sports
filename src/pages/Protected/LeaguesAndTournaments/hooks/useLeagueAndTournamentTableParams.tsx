import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { TableColumnType } from 'antd'
import Flex from 'antd/es/flex'
import { InputRef } from 'antd/es/input'
import { TableProps } from 'antd/es/table/InternalTable'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import LeagueTagType from '@/pages/Protected/LeaguesAndTournaments/components/LeagueTagType'

import CellText from '@/components/Table/CellText'
import FilterDropDown from '@/components/Table/FilterDropDown'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useLeagueSlice } from '@/redux/hooks/useLeagueSlice'
import { useLazyGetLeaguesQuery } from '@/redux/leagues/leagues.api'

import { getIconColor } from '@/utils'

import { PATH_TO_EDIT_LEAGUE, PATH_TO_LEAGUE_PAGE } from '@/common/constants/paths'
import { IFELeague } from '@/common/interfaces/league'

import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IFELeague

interface IParams {
  setSelectedRecordId: (value: string) => void
  setShowDeleteSingleRecordModal: (value: boolean) => void
}

export const useLeagueAndTournamentTableParams = ({ setSelectedRecordId, setShowDeleteSingleRecordModal }: IParams) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const { limit, offset, order_by } = useLeagueSlice()
  const [getLeagues] = useLazyGetLeaguesQuery()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const handleReset = (clearFilters: () => void) => {
    getLeagues({
      limit,
      offset,
      order_by: order_by || undefined,
    })
    clearFilters()
  }

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IFELeague> => ({
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

  const columns: TColumns<IFELeague> = [
    {
      title: 'League/Tourn name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: order_by ? (order_by === 'asc' ? 'ascend' : 'descend') : null,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <TextWithTooltip maxLength={25} text={value} onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + record.id)} />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        { text: 'League', value: 0 },
        { text: 'Tourn', value: 1 },
      ],
      width: '112px',
      render: (value) => <LeagueTagType text={value} />,
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
      title: 'Default Playoff Format',
      dataIndex: 'playoffFormat',
      width: '220px',
      filters: [
        { text: 'Best Record Wins', value: 0 },
        { text: 'Single Elimination Bracket', value: 1 },
      ],
      render: (value) => <CellText> {value}</CellText>,
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
      title: 'Default Standings Format',
      dataIndex: 'standingsFormat',
      width: '225px',
      filters: [
        { text: 'Winning %', value: 0 },
        { text: 'Points', value: 1 },
      ],
      render: (value) => <CellText> {value}</CellText>,
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
      title: 'Default Tiebreakers Format',
      dataIndex: 'tiebreakersFormat',
      width: '235px',
      filters: [
        { text: 'Winning %', value: 0 },
        { text: 'Points', value: 1 },
      ],
      render: (value) => <CellText> {value}</CellText>,
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
      title: 'Description',
      dataIndex: 'description',
      width: '250px',
      render: (value) => <TextWithTooltip maxLength={25} text={value} isRegularText />,
    },
    {
      title: 'Welcome note',
      dataIndex: 'welcomeNote',
      width: '250px',
      render: (value) => <TextWithTooltip maxLength={25} text={value} isRegularText />,
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value) => (
        <Flex vertical={false} justify="center" align="center" className="c-p">
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(PATH_TO_EDIT_LEAGUE + `/${value.id}`)
            }}
          />

          <ReactSVG
            onClick={() => {
              setSelectedRecordId(value.id)
              setShowDeleteSingleRecordModal(true)
            }}
            src={DeleteIcon}
            className="mg-l8"
          />
        </Flex>
      ),
    },
  ]

  return {
    columns,
  }
}
