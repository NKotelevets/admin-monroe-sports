import { Divider, Flex } from 'antd'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { CSSProperties, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import {
  PATH_TO_CREATE_LEAGUE_TOURNAMENT,
  PATH_TO_EDIT_LEAGUE_TOURNAMENT,
  PATH_TO_GROUPS_PAGE,
  PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE,
  PATH_TO_LEAGUE_TEAMS_PAGE,
  PATH_TO_LEAGUE_TOURNAMENT_DELETING_INFO,
  PATH_TO_LEAGUE_TOURNAMENT_IMPORT_INFO,
  PATH_TO_LEAGUE_TOURNAMENT_PAGE,
  PATH_TO_MASTER_TEAMS_PAGE,
  PATH_TO_PLAYOFF_FORMAT_PAGE,
  PATH_TO_SCHEDULE_PAGE,
  PATH_TO_SEASONS_CREATE,
  PATH_TO_SEASONS_DELETING_INFO,
  PATH_TO_SEASONS_DETAILS,
  PATH_TO_SEASONS_EDIT_DETAILS,
  PATH_TO_SEASONS_IMPORT_INFO,
  PATH_TO_SEASONS_PAGE,
  PATH_TO_STANDINGS_FORMAT_PAGE,
  PATH_TO_TIEBREAKERS_PAGE,
  PATH_TO_USERS_PAGE,
} from '@/constants/paths'

import UserIcon from '@/assets/icons/header/user.svg'
import MonroeIcon from '@/assets/icons/monroe.svg'
import GroupsIcon from '@/assets/icons/sidebar/groups.svg'
import LeagueIcon from '@/assets/icons/sidebar/league.svg'
import ScheduleIcon from '@/assets/icons/sidebar/schedule.svg'
import StandingsIcon from '@/assets/icons/sidebar/standings.svg'
import TeamsIcon from '@/assets/icons/sidebar/t-shirt.svg'

const siderStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '8px 0px',
}

type TMenuItem = Required<MenuProps>['items'][number]

const COMPANY_MENU_ITEMS: TMenuItem[] = [
  {
    key: 'monroe-sport',
    label: 'Monroe Sport',
    icon: <ReactSVG src={MonroeIcon} style={{ marginLeft: '5px' }} />,
    children: [],
  },
]

const LEAGUE_AND_TOURN_KEY = 'league-and-tourn-key'
const STANDINGS_DISPLAY_KEY = 'standings-display-key'
const TEAMS_KEY = 'teams-key'

const MonroeSidebar = () => {
  const location = useLocation()
  const pathname = location.pathname
  const isPageThatWillHaveChanges =
    [PATH_TO_CREATE_LEAGUE_TOURNAMENT].includes(pathname) ||
    pathname.includes(PATH_TO_EDIT_LEAGUE_TOURNAMENT) ||
    pathname.includes(PATH_TO_SEASONS_CREATE) ||
    pathname.includes(PATH_TO_SEASONS_EDIT_DETAILS)
  const isLeagueTournamentPage =
    [
      PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE,
      PATH_TO_CREATE_LEAGUE_TOURNAMENT,
      PATH_TO_LEAGUE_TOURNAMENT_DELETING_INFO,
      PATH_TO_LEAGUE_TOURNAMENT_IMPORT_INFO,
    ].includes(pathname) ||
    pathname.includes(PATH_TO_EDIT_LEAGUE_TOURNAMENT) ||
    pathname.includes(PATH_TO_LEAGUE_TOURNAMENT_PAGE)
  const isSeasonsPage =
    [PATH_TO_SEASONS_PAGE, PATH_TO_SEASONS_CREATE, PATH_TO_SEASONS_DELETING_INFO, PATH_TO_SEASONS_IMPORT_INFO].includes(
      pathname,
    ) ||
    pathname.includes(PATH_TO_SEASONS_DETAILS) ||
    pathname.includes(PATH_TO_SEASONS_EDIT_DETAILS)

  const getSelectedSubMenu = () => {
    if ([PATH_TO_MASTER_TEAMS_PAGE, PATH_TO_LEAGUE_TEAMS_PAGE].includes(pathname)) return TEAMS_KEY

    if (isLeagueTournamentPage || isSeasonsPage) return LEAGUE_AND_TOURN_KEY

    if ([PATH_TO_PLAYOFF_FORMAT_PAGE, PATH_TO_STANDINGS_FORMAT_PAGE, PATH_TO_TIEBREAKERS_PAGE].includes(pathname))
      return STANDINGS_DISPLAY_KEY

    return ''
  }

  const getDefaultSelectedKeys = () => {
    if (isLeagueTournamentPage) return PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE

    if (isSeasonsPage) return PATH_TO_SEASONS_PAGE

    return ''
  }

  const navigateTo = (path: string) => {
    window.location.href = path
  }

  const MENU_ITEMS: TMenuItem[] = [
    {
      key: PATH_TO_USERS_PAGE,
      label: 'Users',
      icon: (
        <ReactSVG
          className={location.pathname === PATH_TO_USERS_PAGE ? 'red-icon' : ''}
          src={UserIcon}
          style={{ marginLeft: '5px' }}
        />
      ),
      onClick: () => navigateTo(PATH_TO_USERS_PAGE),
    },
    {
      key: TEAMS_KEY,
      label: 'Teams',
      icon: <ReactSVG src={TeamsIcon} style={{ marginLeft: '5px' }} />,
      children: [
        {
          key: PATH_TO_MASTER_TEAMS_PAGE,
          label: 'Master Teams',
          onClick: () => navigateTo(PATH_TO_MASTER_TEAMS_PAGE),
        },
        { key: 'league-teams', label: 'League Teams', onClick: () => navigateTo(PATH_TO_LEAGUE_TEAMS_PAGE) },
      ],
    },
    {
      key: LEAGUE_AND_TOURN_KEY,
      label: 'League & Tourn',
      icon: <ReactSVG src={LeagueIcon} style={{ marginLeft: '5px' }} />,
      children: [
        {
          key: PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE,
          label: 'League & Tourn',
          onClick: () => navigateTo(PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE),
        },
        { key: PATH_TO_SEASONS_PAGE, label: 'Seasons', onClick: () => navigateTo(PATH_TO_SEASONS_PAGE) },
      ],
    },
    {
      key: STANDINGS_DISPLAY_KEY,
      label: 'Standings Display',
      icon: <ReactSVG src={StandingsIcon} style={{ marginLeft: '5px' }} />,
      children: [
        {
          key: PATH_TO_PLAYOFF_FORMAT_PAGE,
          label: 'Playoff Format',
          onClick: () => navigateTo(PATH_TO_PLAYOFF_FORMAT_PAGE),
        },
        {
          key: PATH_TO_STANDINGS_FORMAT_PAGE,
          label: 'Standings Format',
          onClick: () => navigateTo(PATH_TO_STANDINGS_FORMAT_PAGE),
        },
        { key: PATH_TO_TIEBREAKERS_PAGE, label: 'Tiebreakers', onClick: () => navigateTo(PATH_TO_TIEBREAKERS_PAGE) },
      ],
    },
    {
      key: PATH_TO_SCHEDULE_PAGE,
      label: 'Schedule',
      icon: (
        <ReactSVG
          className={location.pathname === PATH_TO_SCHEDULE_PAGE ? 'red-icon' : ''}
          src={ScheduleIcon}
          style={{ marginLeft: '5px' }}
        />
      ),
      onClick: () => navigateTo(PATH_TO_SCHEDULE_PAGE),
    },
    {
      key: PATH_TO_GROUPS_PAGE,
      label: 'Groups',
      icon: (
        <ReactSVG
          className={location.pathname === PATH_TO_GROUPS_PAGE ? 'red-icon' : ''}
          src={GroupsIcon}
          style={{ marginLeft: '5px' }}
        />
      ),
      onClick: () => navigateTo(PATH_TO_GROUPS_PAGE),
    },
  ]

  const handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
    if (isPageThatWillHaveChanges) e.preventDefault()
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnloadEvent)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadEvent)
    }
  }, [])

  return (
    <Sider width="256px" style={siderStyle}>
      <Flex style={{ padding: '0 15px' }}>
        <Menu
          className="company-menu"
          style={{
            border: 0,
          }}
          mode="inline"
          items={COMPANY_MENU_ITEMS}
        />
      </Flex>

      <Divider style={{ margin: '8px 0' }} />

      <Menu
        defaultSelectedKeys={[location.pathname, getDefaultSelectedKeys()]}
        defaultOpenKeys={[location.pathname, getSelectedSubMenu()]}
        className="items-menu"
        style={{
          border: 0,
        }}
        mode="inline"
        items={MENU_ITEMS}
      />
    </Sider>
  )
}

export default MonroeSidebar
