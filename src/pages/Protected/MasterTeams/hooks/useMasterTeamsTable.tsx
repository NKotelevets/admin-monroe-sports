import Flex from 'antd/es/flex'
import { ColumnGroupType } from 'antd/es/table/interface'
import { ColumnType } from 'rc-table/lib/interface'
import { Fragment, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { DeleteWrapper } from '@/pages/Protected/LeagueTeams/components/DeleteWrapper.ts'

import { MonroeLinkText } from '@/components/Elements'
import TextWithTooltip from '@/components/TextWithTooltip'

import { useMasterTeamsSlice } from '@/redux/hooks/useMasterTeamsSlice'
import { useLazyGetMasterTeamsQuery } from '@/redux/masterTeams/masterTeams.api'

import { useCopyContent } from '@/hooks/useCopyContent.tsx'
import { useTableContext } from '@/hooks/useTableContext.ts'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'

import { getColumnSort } from '@/utils'

import { PATH_TO_EDIT_MASTER_TEAM, PATH_TO_MASTER_TEAMS, PATH_TO_USERS } from '@/common/constants/paths'
import { IFEMasterTeam } from '@/common/interfaces/masterTeams'
import { TColumns } from '@/common/types'

import CopyIcon from '@/assets/icons/copy.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import EditIcon from '@/assets/icons/edit.svg'

interface IUseMasterTableReturn {
  /**
   * Array of column configuration objects for the league team table.
   */
  columns: (ColumnGroupType<IFEMasterTeam> | ColumnType<IFEMasterTeam>)[]
}

/**
 * Custom hook for managing master team table configuration and behavior.
 * Provides column definitions and filtering logic for rendering a table of master teams.
 *
 * @returns {IUseMasterTableReturn} Hook return values.
 * @returns {Array} columns - Array of column configuration objects for the master team table.
 */
export const useMasterTeamsTable = (): IUseMasterTableReturn => {
  const navigate = useNavigate()

  const { getColumnSearchProps } = useTableSearch(handleReset)
  const { setSelectedIds, setSingleDeleting } = useTableContext()
  const { limit, offset, ordering } = useMasterTeamsSlice()
  const { renderTeamAdmins, renderTeamAdminEmail, renderHeadCoachName, renderHeadCoachEmail, renderLinkedLeague } =
    useMasterTeamTableRenderers()

  const [getMasterTeams] = useLazyGetMasterTeamsQuery()

  /**
   * Resets the table by fetching the master teams with the current limit, offset, and ordering.
   */
  function handleReset() {
    getMasterTeams({
      limit,
      offset,
      ordering: ordering || undefined,
    })
  }

  /**
   * Generates a filter function for leagues linked to a master team.
   * Filters leagues by checking if their name includes the search term (case-insensitive).
   *
   * @param {boolean | React.Key} value - The filter value.
   * @param {IFEMasterTeam} record - The current master team record.
   * @returns {boolean} True if any linked league matches the filter value.
   */
  const onFilterLeague = useCallback((value: boolean | React.Key, record: IFEMasterTeam) => {
    return !!record['leagues'].filter((league) => league.name.toLowerCase().includes((value as string).toLowerCase()))
      .length
  }, [])

  /**
   * Generates a filter function for master team admins.
   * Filters administrators by checking if their full name includes the search term (case-insensitive).
   *
   * @param {boolean | React.Key} value - The filter value.
   * @param {IFEMasterTeam} record - The current master team record.
   * @returns {boolean} True if any team administrator matches the filter value.
   */
  const onFilterTeamAdmin = useCallback((value: boolean | React.Key, record: IFEMasterTeam) => {
    return !!record['teamAdmins']?.filter((admin) =>
      `${admin.firstName} ${admin.lastName}`.toLowerCase().includes((value as string).toLowerCase()),
    ).length
  }, [])

  const columns: TColumns<IFEMasterTeam> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: getColumnSort('name', ordering || null),
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
      dataIndex: 'teamAdmins',
      width: '240px',
      ...getColumnSearchProps('teamAdmins', onFilterTeamAdmin),
      sortOrder: getColumnSort('team_admins', ordering || null),
      sorter: true,
      render: renderTeamAdmins,
    },
    {
      title: 'Team Admin Email',
      dataIndex: 'teamAdminEmail',
      width: '240px',
      render: renderTeamAdminEmail,
    },
    {
      title: 'Head Coach',
      dataIndex: 'headCoachFullName',
      width: '240px',
      ...getColumnSearchProps('headCoachFullName'),
      sortOrder: getColumnSort('head_coach', ordering || null),
      sorter: true,
      render: renderHeadCoachName,
    },
    {
      title: 'Coach email',
      dataIndex: 'headCoachEmail',
      width: '240px',
      render: renderHeadCoachEmail,
    },
    {
      title: 'Linked Leagues/Tourns',
      dataIndex: 'league_name',
      width: '240px',
      ...getColumnSearchProps('leagues', onFilterLeague),
      sorter: true,
      sortOrder: getColumnSort('league_name', ordering || null),
      render: renderLinkedLeague,
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
              navigate(PATH_TO_EDIT_MASTER_TEAM + `/${record.id}`)
            }}
          />
          <Flex style={{ marginLeft: 12 }}>
            <DeleteWrapper
              onClick={() => {
                setSingleDeleting(true)
                setSelectedIds([value.id])
              }}
            >
              <ReactSVG src={DeleteIcon} />
            </DeleteWrapper>
          </Flex>
        </Flex>
      ),
    },
  ]

  return {
    columns: columns as (ColumnGroupType<IFEMasterTeam> | ColumnType<IFEMasterTeam>)[],
  }
}

interface IRenderersReturn {
  renderTeamAdmins: ColumnType<IFEMasterTeam>['render']
  renderTeamAdminEmail: ColumnType<IFEMasterTeam>['render']
  renderHeadCoachName: ColumnType<IFEMasterTeam>['render']
  renderHeadCoachEmail: ColumnType<IFEMasterTeam>['render']
  renderLinkedLeague: ColumnType<IFEMasterTeam>['render']
}

/**
 * Custom hook providing renderer functions for a master team table.
 * Each function returns React components for rendering specific columns, including team admins,
 * team admin email, head coach name, head coach email, and linked leagues.
 *
 * @returns {IRenderersReturn} Render functions for master team table columns.
 * @returns {Function} renderTeamAdmins - Renders a list of team admins with clickable names.
 * @returns {Function} renderTeamAdminEmail - Renders the team admin's email with a copy-to-clipboard feature.
 * @returns {Function} renderHeadCoachName - Renders the head coach's name with a clickable link.
 * @returns {Function} renderHeadCoachEmail - Renders the head coach's email with a copy-to-clipboard feature.
 * @returns {Function} renderLinkedLeague - Renders the linked league names as clickable text.
 */
const useMasterTeamTableRenderers = (): IRenderersReturn => {
  const navigate = useNavigate()
  const { copy } = useCopyContent()

  const handleCopyContent = useCallback(async (email: string) => {
    copy(email, 'Email successfully copied')
  }, [])

  const renderTeamAdmins = useCallback(
    (_: unknown, record: IFEMasterTeam) =>
      record.teamAdmins?.map((admin, index) => (
        <Fragment key={`${admin.id}-row-team-admin`}>
          <MonroeLinkText inline={true} underline={false} onClick={() => navigate(PATH_TO_USERS + '/' + admin.id)}>
            {admin.firstName}
          </MonroeLinkText>
          {record.teamAdmins?.length !== index + 1 ? `, ` : undefined}
        </Fragment>
      )),
    [],
  )

  const renderTeamAdminEmail = useCallback(
    (_: unknown, record: IFEMasterTeam) =>
      record.teamAdminEmail ? (
        <Flex align="center" justify="space-between" onClick={() => handleCopyContent(record.teamAdminEmail as string)}>
          <TextWithTooltip maxLength={21} text={record.teamAdminEmail} isRegularText />
          <ReactSVG className="c-p mg-l4" src={CopyIcon} />
        </Flex>
      ) : (
        '-'
      ),
    [],
  )

  const renderHeadCoachName = useCallback(
    (_: unknown, record: IFEMasterTeam) =>
      record.headCoachFullName ? (
        <TextWithTooltip
          maxLength={22}
          text={record.headCoachFullName}
          onClick={() => navigate(PATH_TO_USERS + '/' + record.headCoachId)}
        />
      ) : (
        '-'
      ),
    [],
  )

  const renderHeadCoachEmail = useCallback(
    (_: unknown, record: IFEMasterTeam) =>
      record.headCoachEmail ? (
        <Flex align="center" justify="space-between" onClick={() => handleCopyContent(record.headCoachEmail as string)}>
          <TextWithTooltip maxLength={21} text={record.headCoachEmail} isRegularText />
          <ReactSVG className="c-p mg-l4" src={CopyIcon} />
        </Flex>
      ) : (
        '-'
      ),
    [],
  )

  const renderLinkedLeague = useCallback(
    (_: unknown, record: IFEMasterTeam) => (
      <TextWithTooltip
        maxLength={22}
        text={record.leagues.map((l) => l.name).join(', ') || '-'}
        onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + record.id)}
      />
    ),
    [],
  )

  return {
    renderTeamAdmins,
    renderTeamAdminEmail,
    renderHeadCoachName,
    renderHeadCoachEmail,
    renderLinkedLeague,
  }
}
