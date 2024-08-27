import FilterFilled from '@ant-design/icons/lib/icons/FilterFilled'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Button, InputRef, TableColumnType } from 'antd'
import Input from 'antd/es/input/Input'
import { TableProps } from 'antd/es/table'
import { FilterDropdownProps } from 'antd/es/table/interface'
import { format } from 'date-fns'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { MonroeBlueText } from '@/components/Elements'
import CellText from '@/components/Table/CellText'
import MonroeFilter from '@/components/Table/MonroeFilter'
import TagType from '@/components/Table/TagType'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useLazyGetSeasonBEDetailsQuery, useUpdateSeasonMutation } from '@/redux/seasons/seasons.api'

import { PATH_TO_LEAGUE_PAGE } from '@/constants/paths'

import { IImportedSubdivision, IUpdateDivision } from '@/common/interfaces/division'
import { IImportSeasonTableRecord, ISeasonReviewUpdateData } from '@/common/interfaces/season'
import { TSortOption } from '@/common/types'

import SyncIcon from '@/assets/icons/sync.svg'

type TColumns<T> = TableProps<T>['columns']
type TDataIndex = keyof IImportSeasonTableRecord

export const useSeasonsImportTable = (
  sortSeasonNameOrder: TSortOption,
  sortLeagueNameOrder: TSortOption,
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  const navigate = useNavigate()
  const searchInput = useRef<InputRef>(null)
  const [getSeasonDetails] = useLazyGetSeasonBEDetailsQuery()
  const { removeDuplicate } = useSeasonSlice()
  const [updateSeason] = useUpdateSeasonMutation()
  const { duplicates } = useSeasonSlice()

  const handleUpdate = async (idx: number) => {
    const currentDuplicate = duplicates.find((duplicate) => duplicate.index === idx)
    const duplicateData = await getSeasonDetails(currentDuplicate!.existing.id).unwrap()
    const newData = currentDuplicate!.new

    const normalizedNewData: ISeasonReviewUpdateData = {
      expectedEndDate: format(newData.expectedEndDate, 'dd MMM yyyy'),
      linkedLeagueName: newData.linkedLeagueTournament,
      name: newData.name,
      startDate: format(newData.startDate, 'dd MMM yyyy'),
      divisions: [
        {
          name: newData.divisionPollName,
          description: newData.divisionPollDescription,
          sub_division: [
            {
              name: newData.subdivisionPollName,
              playoff_format: newData.playoffFormat,
              standings_format: newData.standingsFormat,
              tiebreakers_format: newData.tiebreakersFormat,
              description: newData.subdivisionPollDescription,
              brackets: [],
              changed: false,
            },
          ],
        },
      ],
    }
    const normalizedExistingData: ISeasonReviewUpdateData = {
      expectedEndDate: format(newData.expectedEndDate, 'dd MMM yyyy'),
      linkedLeagueName: duplicateData.league.name,
      name: duplicateData.name,
      startDate: format(duplicateData.start_date, 'dd MMM yyyy'),
      divisions: duplicateData.divisions.map((division) => ({
        name: division.name,
        description: division.description,
        sub_division: division.sub_division.map((subdivision) => ({
          name: subdivision.name,
          description: subdivision.description,
          playoff_format: subdivision.playoff_format === 0 ? 'Best Record Wins' : 'Single Elimination Bracket',
          standings_format: subdivision.standings_format === 0 ? 'Winning %' : 'Points',
          tiebreakers_format: subdivision.tiebreakers_format === 0 ? 'Winning %' : 'Points',
          changed: subdivision.changed,
          brackets: subdivision.brackets,
        })),
      })),
    }
    const currentDivision = normalizedExistingData.divisions.find(
      (division) => division.name === normalizedNewData.divisions[0].name,
    )
    const newSubdivision = normalizedNewData.divisions[0].sub_division[0]
    const existedSubdivision = currentDivision?.sub_division.find(
      (subdivision) => subdivision.name === normalizedNewData.divisions[0].sub_division[0].name,
    )
    const isDifference = existedSubdivision
      ? !(
          newSubdivision.playoff_format === existedSubdivision.playoff_format &&
          newSubdivision.standings_format === existedSubdivision.standings_format &&
          newSubdivision.tiebreakers_format === existedSubdivision.tiebreakers_format &&
          newSubdivision.description === existedSubdivision.description
        )
      : true
    const isDivisionOrSubdivisionChanged = currentDivision ? !!isDifference : true

    const mappedDivisions: IUpdateDivision[] = duplicateData.divisions.map((division) => ({
      name: division.name,
      description: division.description,
      sub_division: division.sub_division.map((subdivision) => ({
        name: subdivision.name,
        description: subdivision.description,
        playoff_format: subdivision.playoff_format === 'Best Record Wins' ? 0 : 1,
        standings_format: subdivision.standings_format === 'Winning %' ? 0 : 1,
        tiebreakers_format: subdivision.tiebreakers_format === 'Winning %' ? 0 : 1,
        brackets: [],
        changed: subdivision.changed,
      })),
    }))

    const mappedNewDivisions: IUpdateDivision[] = normalizedNewData.divisions.map((division) => ({
      name: division.name,
      description: division.description,
      sub_division: division.sub_division.map((subdivision) => ({
        name: subdivision.name,
        description: subdivision.description,
        playoff_format: subdivision.playoff_format === 'Best Record Wins' ? 0 : 1,
        standings_format: subdivision.standings_format === 'Winning %' ? 0 : 1,
        tiebreakers_format: subdivision.tiebreakers_format === 'Winning %' ? 0 : 1,
        brackets: [],
        changed: subdivision.changed,
      })),
    }))

    let updatingMappedDivisions: IUpdateDivision[] = []

    if (currentDivision) {
      const updatedDivision = existedSubdivision
        ? {
            ...currentDivision,
            sub_division: currentDivision?.sub_division.map((subdivision) => {
              if (subdivision.name === mappedNewDivisions[0].sub_division[0].name)
                return mappedNewDivisions[0].sub_division[0]
              return subdivision
            }),
          }
        : ({
            ...currentDivision,
            sub_division: [
              ...(currentDivision?.sub_division as IImportedSubdivision[]),
              mappedNewDivisions[0].sub_division[0],
            ],
          } as IUpdateDivision)

      updatingMappedDivisions = mappedDivisions.map((division) => {
        if (division.name === updatedDivision.name) return updatedDivision as IUpdateDivision
        return division
      })
    } else {
      updatingMappedDivisions = [
        ...mappedDivisions,
        {
          ...normalizedNewData.divisions[0],
          sub_division: normalizedNewData.divisions[0].sub_division.map((subdivision) => ({
            name: subdivision.name,
            description: subdivision.description,
            playoff_format: subdivision.playoff_format === 'Best Record Wins' ? 0 : 1,
            standings_format: subdivision.standings_format === 'Points' ? 0 : 1,
            tiebreakers_format: subdivision.tiebreakers_format === 'Points' ? 0 : 1,
            changed: subdivision.changed,
            brackets: subdivision.brackets,
          })),
        },
      ]
    }

    const divisions = isDivisionOrSubdivisionChanged ? updatingMappedDivisions : mappedDivisions

    updateSeason({
      id: duplicateData.id,
      body: {
        name: normalizedExistingData.name,
        start_date: format(newData.startDate, 'yyyy-MM-dd'),
        expected_end_date: format(newData.expectedEndDate, 'yyyy-MM-dd'),
        league_id: duplicateData.league.id,
        divisions,
      },
    }).then(() => {
      removeDuplicate(idx)
    })
  }

  const handleReset = (clearFilters: () => void) => clearFilters()

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => confirm()

  const getColumnSearchProps = (dataIndex: TDataIndex): TableColumnType<IImportSeasonTableRecord> => ({
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

  const columns: TColumns<IImportSeasonTableRecord> = [
    {
      title: 'Season name',
      dataIndex: 'name',
      width: '240px',
      sorter: (s1, s2) => s1.name.localeCompare(s2.name),
      sortOrder: sortSeasonNameOrder,
      ...getColumnSearchProps('name'),
      render: (value, record) => (
        <CellText
          isLink
          onClick={() => {
            record.type === 'Duplicate' && setSelectedIdx(record.idx)
          }}
        >
          {value}
        </CellText>
      ),
    },
    {
      title: 'Linked League/Tourn',
      dataIndex: 'leagueName',
      width: '240px',

      sortOrder: sortLeagueNameOrder,
      sorter: (s1, s2) => s1.leagueName.localeCompare(s2.leagueName),
      ...getColumnSearchProps('leagueName'),
      render: (value, record) => (
        <CellText isLink onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + record.leagueId)}>
          {value}
        </CellText>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'type',
      filters: [
        { text: 'Duplicate', value: 'Duplicate' },
        { text: 'Error', value: 'Error' },
      ],
      width: '132px',
      onFilter: (value, record) => value === record.type,
      render: (_, record) => <TagType text={record.type} />,
      filterDropdown: MonroeFilter,
      filterIcon: (filtered) => (
        <FilterFilled
          style={{
            color: filtered ? 'rgba(26, 22, 87, 1)' : 'rgba(189, 188, 194, 1)',
          }}
        />
      ),
    },
    {
      title: 'Error info',
      dataIndex: 'message',
      render: (value) => <MonroeBlueText>{value}</MonroeBlueText>,
    },
    {
      title: '',
      dataIndex: '',
      width: '80px',
      render: (_, record) =>
        record.type === 'Duplicate' && (
          <ReactSVG style={{ cursor: 'pointer' }} src={SyncIcon} onClick={() => handleUpdate(record.idx)} />
        ),
    },
  ]

  return { columns }
}

