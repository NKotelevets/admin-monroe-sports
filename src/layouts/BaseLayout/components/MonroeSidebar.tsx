import { Flex } from 'antd'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { CSSProperties, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { MonroeDivider } from '@/components/Elements'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'

import {
  PATH_TO_CREATE_LEAGUE,
  PATH_TO_CREATE_SEASON,
  PATH_TO_CREATE_USER,
  PATH_TO_EDIT_LEAGUE,
  PATH_TO_EDIT_SEASON,
  PATH_TO_EDIT_USER,
  PATH_TO_EVENTS,
  PATH_TO_GROUPS,
  PATH_TO_LEAGUES,
  PATH_TO_LEAGUE_TEAMS,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_PLAYOFF_FORMAT,
  PATH_TO_SEASONS,
  PATH_TO_STANDINGS_FORMAT,
  PATH_TO_TIEBREAKERS,
  PATH_TO_USERS,
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
const USERS_KEY = 'users'

const MonroeSidebar = () => {
  const location = useLocation()
  const pathname = location.pathname
  const isPageThatWillHaveChanges =
    [PATH_TO_CREATE_LEAGUE].includes(pathname) ||
    pathname.includes(PATH_TO_EDIT_LEAGUE) ||
    pathname.includes(PATH_TO_CREATE_SEASON) ||
    pathname.includes(PATH_TO_EDIT_SEASON) ||
    pathname.includes(PATH_TO_CREATE_USER) ||
    pathname.includes(PATH_TO_EDIT_USER)
  const isLeagueTournamentPage = pathname.includes(PATH_TO_LEAGUES)
  const isSeasonsPage = pathname.includes(PATH_TO_SEASONS)
  const isUsersPage = pathname.includes(PATH_TO_USERS)
  const isMasterTeamsPage = pathname.includes(PATH_TO_MASTER_TEAMS)

  const { setIsCreateBracketPage, setSelectedBracketId } = useSeasonSlice()

  const getSelectedSubMenu = () => {
    if ([PATH_TO_MASTER_TEAMS, PATH_TO_LEAGUE_TEAMS].includes(pathname)) return TEAMS_KEY

    if (isLeagueTournamentPage || isSeasonsPage) return LEAGUE_AND_TOURN_KEY

    if (isUsersPage) return USERS_KEY

    if (isMasterTeamsPage) return TEAMS_KEY

    if ([PATH_TO_PLAYOFF_FORMAT, PATH_TO_STANDINGS_FORMAT, PATH_TO_TIEBREAKERS].includes(pathname))
      return STANDINGS_DISPLAY_KEY

    return ''
  }

  const getDefaultSelectedKeys = () => {
    if (isLeagueTournamentPage) return PATH_TO_LEAGUES

    if (isSeasonsPage) return PATH_TO_SEASONS

    if (isMasterTeamsPage) return PATH_TO_MASTER_TEAMS

    return ''
  }

  const navigateTo = (path: string) => {
    window.location.href = path
  }

  const MENU_ITEMS: TMenuItem[] = [
    {
      key: USERS_KEY,
      label: 'Users',
      icon: <ReactSVG className={isUsersPage ? 'red-icon' : ''} src={UserIcon} style={{ marginLeft: '5px' }} />,
      onClick: () => navigateTo(PATH_TO_USERS),
      className: isUsersPage ? 'red-text' : '',
      style: isUsersPage
        ? {
            backgroundColor: '#fcf1ed',
            borderRight: '3px solid #BC261B',
          }
        : {},
    },
    {
      key: TEAMS_KEY,
      label: 'Teams',
      icon: <ReactSVG src={TeamsIcon} style={{ marginLeft: '5px' }} />,
      children: [
        {
          key: PATH_TO_MASTER_TEAMS,
          label: 'Master Teams',
          onClick: () => navigateTo(PATH_TO_MASTER_TEAMS),
        },
        { key: 'league-teams', label: 'League Teams', onClick: () => navigateTo(PATH_TO_LEAGUE_TEAMS) },
      ],
    },
    {
      key: LEAGUE_AND_TOURN_KEY,
      label: 'League & Tourn',
      icon: <ReactSVG src={LeagueIcon} style={{ marginLeft: '5px' }} />,
      children: [
        {
          key: PATH_TO_LEAGUES,
          label: 'League & Tourn',
          onClick: () => navigateTo(PATH_TO_LEAGUES),
        },
        { key: PATH_TO_SEASONS, label: 'Seasons', onClick: () => navigateTo(PATH_TO_SEASONS) },
      ],
    },
    {
      key: STANDINGS_DISPLAY_KEY,
      label: 'Standings Display',
      icon: <ReactSVG src={StandingsIcon} style={{ marginLeft: '5px' }} />,
      children: [
        {
          key: PATH_TO_PLAYOFF_FORMAT,
          label: 'Playoff Format',
          onClick: () => navigateTo(PATH_TO_PLAYOFF_FORMAT),
        },
        {
          key: PATH_TO_STANDINGS_FORMAT,
          label: 'Standings Format',
          onClick: () => navigateTo(PATH_TO_STANDINGS_FORMAT),
        },
        { key: PATH_TO_TIEBREAKERS, label: 'Tiebreakers', onClick: () => navigateTo(PATH_TO_TIEBREAKERS) },
      ],
    },
    {
      key: PATH_TO_EVENTS,
      label: 'Events',
      icon: (
        <ReactSVG
          className={location.pathname === PATH_TO_EVENTS ? 'red-icon' : ''}
          src={ScheduleIcon}
          style={{ marginLeft: '5px' }}
        />
      ),
      onClick: () => navigateTo(PATH_TO_EVENTS),
    },
    {
      key: PATH_TO_GROUPS,
      label: 'Groups',
      icon: (
        <ReactSVG
          className={location.pathname === PATH_TO_GROUPS ? 'red-icon' : ''}
          src={GroupsIcon}
          style={{ marginLeft: '5px' }}
        />
      ),
      onClick: () => navigateTo(PATH_TO_GROUPS),
    },
  ]

  const handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
    if (isPageThatWillHaveChanges) e.preventDefault()

    setIsCreateBracketPage(false)
    setSelectedBracketId(null)
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

      <MonroeDivider style={{ margin: '8px 0' }} />

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
