import { getColumnSort } from '@/utils'
import TextWithTooltip from '@/components/TextWithTooltip.tsx'
import {
  PATH_TO_EDIT_LEAGUE_TEAM,
  PATH_TO_LEAGUE_PAGE,
  PATH_TO_LEAGUE_TEAMS,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_USERS
} from '@/common/constants/paths.ts'
import { TColumns } from '@/common/types'
import { IFELeagueTeam } from '@/common/interfaces/leagueTeams.ts'
import { useTableSearch } from '@/hooks/useTableSearch.tsx'
import { useLazyGetLeagueTeamsQuery } from '@/redux/leagueTeams/leagueTeams.api.ts'
import { useLeagueTeamsSlice } from '@/redux/hooks/useLeagueTeamsSlice.tsx'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { MonroeLinkText } from '@/components/Elements'
import Flex from 'antd/es/flex'
import { ReactSVG } from 'react-svg'
import EditIcon from '@/assets/icons/edit.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import CopyIcon from '@/assets/icons/copy.svg'
import { useCopyContent } from '@/hooks/useCopyContent.tsx'

const EMAIL_COPIED_MESSAGE = 'Email successfully copied'

interface IParams {
  setSelectedIds: (value: string[]) => void
  setSingleDeleting: (value: boolean) => void
}

export const useLeagueTeamTable = ({ setSelectedIds, setSingleDeleting }: IParams) => {
  const navigate = useNavigate()

  const [getLeagueTeams] = useLazyGetLeagueTeamsQuery()

  const { getColumnSearchProps } = useTableSearch(handleReset)
  const { limit, offset, ordering } = useLeagueTeamsSlice()
  const {
    renderTeamName,
    renderLeague,
    renderDivision,
    renderMasterTeam,
    renderCoachName,
    renderCoachEmail,
    renderTeamAdminName,
    renderTeamAdminEmail
  } = useLeagueTeamTableRenderers()

  useEffect(() => {
    setSelectedIds([])
  }, [])

  function handleReset() {
    getLeagueTeams({
      limit,
      offset,
      ordering: ordering || undefined
    })
  }

  const columns: TColumns<IFELeagueTeam> = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: '240px',
      sortOrder: getColumnSort('name', ordering),
      ...getColumnSearchProps('name'),
      render: renderTeamName
    },
    {
      title: 'Linked Leagues/Tourns',
      dataIndex: 'league',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('league', ordering),
      ...getColumnSearchProps('league'),
      render: renderLeague
    },
    {
      title: 'Division / Pool',
      dataIndex: 'division',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('division', ordering),
      ...getColumnSearchProps('division'),
      render: renderDivision
    },
    {
      title: 'Master Team',
      dataIndex: 'masterTeam',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('masterTeam', ordering),
      ...getColumnSearchProps('masterTeam'),
      render: renderMasterTeam
    },
    {
      title: 'Team Admin Name',
      dataIndex: 'masterTeam',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('masterTeam', ordering),
      ...getColumnSearchProps('masterTeam'),
      render: renderTeamAdminName
    },
    {
      title: 'Team Admin Email',
      dataIndex: 'masterTeam',
      width: '240px',
      sortOrder: getColumnSort('masterTeam', ordering),
      render: renderTeamAdminEmail
    },
    {
      title: 'Coach Name',
      dataIndex: 'masterTeam',
      sorter: true,
      width: '240px',
      sortOrder: getColumnSort('masterTeam', ordering),
      ...getColumnSearchProps('masterTeam'),
      render: renderCoachName
    },
    {
      title: 'Coach Email',
      dataIndex: 'masterTeam',
      width: '240px',
      render: renderCoachEmail
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
          <ReactSVG
            className="mg-l8"
            onClick={() => {
              setSingleDeleting(true)
              setSelectedIds([value.id])
            }}
            src={DeleteIcon}
          />
        </Flex>
      )
    }
  ]

  return {
    columns
  }
}

const useLeagueTeamTableRenderers = () => {
  const navigate = useNavigate()
  const { copy } = useCopyContent()

  const renderTeamName = useCallback((_: unknown, record: IFELeagueTeam) => (
    <TextWithTooltip
      maxLength={22}
      text={record.name}
      onClick={() => navigate(PATH_TO_LEAGUE_TEAMS + '/' + record.id)}
    />
  ), [])

  const renderLeague = useCallback((_: unknown, { league }: IFELeagueTeam) => (
    <MonroeLinkText
      inline={true}
      underline={false}
      onClick={() => navigate(PATH_TO_LEAGUE_PAGE + '/' + league?.id)}
    >
      {league?.name ? league.name : '-'}
    </MonroeLinkText>
  ), [])

  const renderDivision = useCallback((_: unknown, { division }: IFELeagueTeam) => (
    division?.name ? division.name : '-'
  ), [])

  const renderMasterTeam = useCallback((_: unknown, { masterTeam }: IFELeagueTeam) => (
    <MonroeLinkText
      inline={true}
      underline={false}
      onClick={() => navigate(PATH_TO_MASTER_TEAMS + '/' + masterTeam?.id)}
    >
      {masterTeam?.name ? masterTeam.name : '-'}
    </MonroeLinkText>
  ), [])

  const renderCoachName = useCallback((_: unknown, { headCoach }: IFELeagueTeam) => (
    <MonroeLinkText
      inline={true}
      underline={false}
      onClick={() => navigate(PATH_TO_USERS + '/' + headCoach?.id)}
    >
      {headCoach?.firstName && headCoach?.lastName
        ? (`${headCoach?.firstName} ${headCoach?.lastName}`)
        : '-'
      }
    </MonroeLinkText>
  ), [])

  const renderCoachEmail = useCallback((_: unknown, { headCoach }: IFELeagueTeam) => {
    const email = headCoach?.email
    if (!email) return '-'

    return (
      <Flex
        align="center"
        justify="space-between"
        onClick={() => copy(email, EMAIL_COPIED_MESSAGE)}
      >
        <TextWithTooltip maxLength={21} text={email} isRegularText />
        <ReactSVG className="c-p mg-l4" src={CopyIcon} />
      </Flex>
  )
  }, [])

  const renderTeamAdminName = useCallback((_: unknown, { masterTeam }: IFELeagueTeam) => (
    <MonroeLinkText
      inline={true}
      underline={false}
      onClick={() => navigate(PATH_TO_USERS + '/' + masterTeam?.teamAdmin?.id)}
    >
      {masterTeam?.teamAdmin?.firstName && masterTeam?.teamAdmin?.lastName
        ? (`${masterTeam?.teamAdmin?.firstName} ${masterTeam?.teamAdmin?.lastName}`)
        : '-'
      }
    </MonroeLinkText>
  ), [])

  const renderTeamAdminEmail = useCallback((_: unknown, { masterTeam }: IFELeagueTeam) => {
    const email = masterTeam?.teamAdmin?.email
    if (!email) return '-'

    return (
      <Flex
        align="center"
        justify="space-between"
        onClick={() => copy(email, EMAIL_COPIED_MESSAGE)}
      >
        <TextWithTooltip maxLength={21} text={email} isRegularText />
        <ReactSVG className="c-p mg-l4" src={CopyIcon} />
      </Flex>
    )
  }, [])

  return {
    renderTeamName,
    renderLeague,
    renderDivision,
    renderMasterTeam,
    renderCoachName,
    renderCoachEmail,
    renderTeamAdminName,
    renderTeamAdminEmail
  }
}
