import { CloseCircleOutlined } from '@ant-design/icons'
import { Tag, Tooltip } from 'antd'
import Flex from 'antd/es/flex'
import { ColumnGroupType } from 'antd/es/table/interface'
import { ColumnType } from 'rc-table/lib/interface'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { DeleteWrapper } from '@/pages/Protected/LeagueTeams/components/DeleteWrapper.ts'

import { MonroeLinkText } from '@/components/Elements'
import TextWithTooltip from '@/components/TextWithTooltip.tsx'

import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'

import { useCopyContent } from '@/hooks/useCopyContent.tsx'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'

import { getColumnSort } from '@/utils'

import {
  PATH_TO_EDIT_LEAGUE_TEAM,
  PATH_TO_LEAGUE_PAGE,
  PATH_TO_LEAGUE_TEAMS,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_USERS,
} from '@/common/constants/paths.ts'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { TColumns } from '@/common/types'

import CopyIcon from '@/assets/icons/copy.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

const EMAIL_COPIED_MESSAGE = 'Email successfully copied'

interface IUseLeagueTableReturn {
  /**
   * Array of column configuration objects for the league team table.
   */
  columns: (ColumnGroupType<IFELeagueTeam> | ColumnType<IFELeagueTeam>)[]
}

/**
 * Custom hook for managing league team table configuration and behavior.
 * Provides column definitions and filtering logic for rendering a table of league teams.
 *
 * @returns {IUseLeagueTableReturn} Hook return values.
 * @returns {Array} columns - Array of column configuration objects for the league team table.
 */
export const useLeagueTeamTable = (): IUseLeagueTableReturn => {
  const navigate = useNavigate()
  const { setSelectedIds, setSingleDeleting } = useTableContext<IFELeagueTeam>()

  const [getLeagueTeams] = useLazyGetLeagueTeamsQuery()

  const { getColumnSearchProps } = useTableSearch(handleReset)
  const { limit, offset, ordering } = useLeagueTeamsSlice()
  const {
    renderTeamName,
    renderLeague,
    renderDivision,
    renderSubdivision,
    renderMasterTeam,
    renderCoachName,
    renderCoachEmail,
    renderTeamAdminName,
    renderTeamAdminEmail,
  } = useLeagueTeamTableRenderers()

  useEffect(() => {
    setSelectedIds([])
  }, [])

  function handleReset() {
    getLeagueTeams({
      limit,
      offset,
      ordering: ordering || undefined,
    })
  }

  const onFilter = useCallback(
    (fieldName: keyof Pick<IFELeagueTeam, 'league' | 'division' | 'subdivision' | 'season'>) =>
      (value: boolean | React.Key, record: IFELeagueTeam) => {
        return !!record[fieldName]?.name.toLowerCase().includes((value as string).toLowerCase())
      },
    [],
  )

  const columns: TColumns<IFELeagueTeam> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: getColumnSort('name', ordering),
      ...getColumnSearchProps('name'),
      render: renderTeamName,
    },
    {
      title: 'Linked Leagues/Tourns',
      dataIndex: 'league',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('league_name', ordering),
      ...getColumnSearchProps('league', onFilter('league')),
      render: renderLeague,
    },
    {
      title: 'Linked Season',
      dataIndex: 'season',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('season_name', ordering),
      ...getColumnSearchProps('season', onFilter('season')),
      render: renderLeague,
    },
    {
      title: 'Division / Pool',
      dataIndex: 'division',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('division_name', ordering),
      ...getColumnSearchProps('division', onFilter('division')),
      render: renderDivision,
    },
    {
      title: 'Subdivision / Pool',
      dataIndex: 'subdivision',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('subdivision_name', ordering),
      ...getColumnSearchProps('subdivision', onFilter('subdivision')),
      render: renderSubdivision,
    },
    {
      title: 'Master Team',
      dataIndex: 'masterTeam',
      width: '240px',
      render: renderMasterTeam,
    },
    {
      title: 'Team Admin Name',
      dataIndex: 'masterTeam',
      width: '240px',
      render: renderTeamAdminName,
    },
    {
      title: 'Team Admin Email',
      dataIndex: 'masterTeam',
      width: '240px',
      render: renderTeamAdminEmail,
    },
    {
      title: 'Coach Name',
      dataIndex: 'masterTeam',
      width: '240px',
      render: renderCoachName,
    },
    {
      title: 'Coach Email',
      dataIndex: 'masterTeam',
      width: '240px',
      render: renderCoachEmail,
    },
    {
      title: 'Actions',
      dataIndex: '',
      width: '96px',
      fixed: 'right',
      render: (value, record) => (
        <Flex className="c-p" justify="center" align="center">
          <ReactSVG
            src={EditIcon}
            onClick={() => {
              navigate(PATH_TO_EDIT_LEAGUE_TEAM + `/${record.id}`)
            }}
          />

          <Flex style={{ marginLeft: 12 }}>
            <Tooltip
              placement="left"
              title={!record.canBeDeleted ? `You can't delete a league team that has events` : ''}
            >
              <DeleteWrapper
                onClick={
                  record.canBeDeleted
                    ? () => {
                        setSingleDeleting(true)
                        setSelectedIds([value.id])
                      }
                    : undefined
                }
              >
                <ReactSVG src={DeleteIcon} />
              </DeleteWrapper>
            </Tooltip>
          </Flex>
        </Flex>
      ),
    },
  ]

  return {
    columns: columns as (ColumnGroupType<IFELeagueTeam> | ColumnType<IFELeagueTeam>)[],
  }
}

interface IRenderersReturn {
  /**
   *  Renders the team name with a clickable link to its details page.
   */
  renderTeamName: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the league name with a clickable link to the league page.
   */
  renderLeague: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the division name or a placeholder if not available.
   */
  renderSubdivision: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the subdivision name or a placeholder if not available.
   */
  renderDivision: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the master team name with a clickable link to its details page.
   */
  renderMasterTeam: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the head coach's name with a clickable link to their profile.
   */
  renderCoachName: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the head coach's email with a copy-to-clipboard feature.
   */
  renderCoachEmail: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the team admin's name with a clickable link to their profile.
   */
  renderTeamAdminName: ColumnType<IFELeagueTeam>['render']
  /**
   * Renders the team admin's email with a copy-to-clipboard feature.
   */
  renderTeamAdminEmail: ColumnType<IFELeagueTeam>['render']
}

/**
 * Custom hook providing renderer functions for a league team table.
 * Each function returns React components for rendering specific columns, such as team names,
 * leagues, divisions, subdivisions, master teams, coaches, and team admin details.
 *
 * @returns {IRenderersReturn} Render functions for league team table columns.
 */
const useLeagueTeamTableRenderers = (): IRenderersReturn => {
  const navigate = useNavigate()
  const { copy } = useCopyContent()

  const renderTeamName = useCallback(
    (_: unknown, record: IFELeagueTeam) => (
      <TextWithTooltip
        maxLength={22}
        text={record.name}
        onClick={() => navigate(PATH_TO_LEAGUE_TEAMS + '/' + record.id)}
      />
    ),
    [],
  )

  const renderLeague = useCallback(
    (_: unknown, { league }: IFELeagueTeam) => (
      <MonroeLinkText inline={true} underline={false} onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + league?.id)}>
        {league?.name ? league.name : '-'}
      </MonroeLinkText>
    ),
    [],
  )

  const renderDivision = useCallback(
    (_: unknown, { division }: IFELeagueTeam) => (division?.name ? division.name : '-'),
    [],
  )

  const renderSubdivision = useCallback(
    (_: unknown, { subdivision }: IFELeagueTeam) => (subdivision?.name ? subdivision.name : '-'),
    [],
  )

  const renderMasterTeam = useCallback(
    (_: unknown, { masterTeam }: IFELeagueTeam) => (
      <MonroeLinkText
        inline={true}
        underline={false}
        onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + masterTeam?.id)}
      >
        {masterTeam?.name ? (
          masterTeam.name
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="orange">
            Waiting for MT
          </Tag>
        )}
      </MonroeLinkText>
    ),
    [],
  )

  const renderCoachName = useCallback(
    (_: unknown, { headCoach }: IFELeagueTeam) => (
      <MonroeLinkText inline={true} underline={false} onClick={() => navigate(PATH_TO_USERS + '/' + headCoach?.id)}>
        {headCoach?.firstName && headCoach?.lastName ? `${headCoach?.firstName} ${headCoach?.lastName}` : '-'}
      </MonroeLinkText>
    ),
    [],
  )

  const renderCoachEmail = useCallback((_: unknown, { headCoach }: IFELeagueTeam) => {
    const email = headCoach?.email
    if (!email) return '-'

    return (
      <Flex align="center" justify="space-between" onClick={() => copy(email, EMAIL_COPIED_MESSAGE)}>
        <TextWithTooltip maxLength={21} text={email} isRegularText />
        <ReactSVG className="c-p mg-l4" src={CopyIcon} />
      </Flex>
    )
  }, [])

  const renderTeamAdminName = useCallback(
    (_: unknown, { adminData }: IFELeagueTeam) => (
      <MonroeLinkText
        inline={true}
        underline={false}
        onClick={() => navigate(PATH_TO_USERS + '/' + (adminData?.length ? adminData[0].id : ''))}
      >
        {adminData?.length && adminData[0].name}
      </MonroeLinkText>
    ),
    [],
  )

  const renderTeamAdminEmail = useCallback((_: unknown, { adminData }: IFELeagueTeam) => {
    const email = adminData ? adminData[0].email : undefined
    if (!email) return '-'

    return (
      <Flex align="center" justify="space-between" onClick={() => copy(email, EMAIL_COPIED_MESSAGE)}>
        <TextWithTooltip maxLength={21} text={email} isRegularText />
        <ReactSVG className="c-p mg-l4" src={CopyIcon} />
      </Flex>
    )
  }, [])

  return {
    renderTeamName,
    renderLeague,
    renderSubdivision,
    renderDivision,
    renderMasterTeam,
    renderCoachName,
    renderCoachEmail,
    renderTeamAdminName,
    renderTeamAdminEmail,
  }
}
