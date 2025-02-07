import { Divider, Flex } from 'antd'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { CSSProperties, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ReactSVG } from 'react-svg'

import { Link } from '@/components/Link.tsx'

import { useSeasonSlice } from '@/redux/hooks/useSeasonSlice'
import { useUserSlice } from '@/redux/hooks/useUserSlice'

import {
  PATH_TO_CREATE_LEAGUE,
  PATH_TO_CREATE_LEAGUE_TEAM,
  PATH_TO_CREATE_MASTER_TEAM,
  PATH_TO_CREATE_SEASON,
  PATH_TO_CREATE_USER,
  PATH_TO_EDIT_EVENT,
  PATH_TO_EDIT_LEAGUE,
  PATH_TO_EDIT_LEAGUE_TEAM,
  PATH_TO_EDIT_MASTER_TEAM,
  PATH_TO_EDIT_SEASON,
  PATH_TO_EDIT_USER,
  PATH_TO_EVENTS,
  PATH_TO_LEAGUES,
  PATH_TO_LEAGUE_TEAMS,
  PATH_TO_LOCATIONS,
  PATH_TO_LOCATIONS_EDIT,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_PLAYOFF_FORMAT,
  PATH_TO_SEASONS,
  PATH_TO_STANDINGS_FORMAT,
  PATH_TO_TIEBREAKERS,
  PATH_TO_USERS,
} from '@/common/constants/paths'

import UserIcon from '@/assets/icons/header/user.svg'
import MonroeIcon from '@/assets/icons/monroe.svg'
import LeagueIcon from '@/assets/icons/sidebar/league.svg'
import MapIcon from '@/assets/icons/sidebar/map.svg'
import ScheduleIcon from '@/assets/icons/sidebar/schedule.svg'
import TeamsIcon from '@/assets/icons/sidebar/t-shirt.svg'
import { colors } from '@/utils/colors.tsx'
import { SVGIcon } from '@/components/SVGIcon.tsx'
import styled from '@emotion/styled'

const siderStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '8px 0px',
}

type TMenuItem = Required<MenuProps>['items'][number]

const COMPANY_MENU_ITEMS: TMenuItem[] = [
  {
    key: 'monroe-sport',
    label: (
      <Flex vertical={false} align={'center'} gap={8}>
        <Flex style={{backgroundColor: '#fff', width: 32, height: 32, marginLeft: 4}} justify='center' align='center'>
          <ReactSVG src={MonroeIcon} />
        </Flex>
        Monroe Sport
      </Flex>
    ),
    children: [],
  },
]

const LEAGUE_AND_TOURN_KEY = 'league-and-tourn-key'
const STANDINGS_DISPLAY_KEY = 'standings-display-key'
const TEAMS_KEY = 'teams-key'
const USERS_KEY = 'users'
const LOCATIONS_KEY = 'locations'
const EVENTS_KEY = 'events'

/**
 * @function MonroeSidebar
 *
 * Represents a sidebar component used within the Monroe application. It dynamically adjusts its structure
 * and behavior based on defined paths and user navigation. The component contains menu items tailored
 * for navigating through specific categories such as Users, Teams, Locations, and Events.
 *
 * It also includes functionality such as:
 * - Identifying and setting selected menu keys based on the current page.
 * - Managing state transitions for specific application actions (e.g., bracket creation).
 * - Handling unsaved changes through the `beforeunload` event listener.
 *
 * The component leverages `useEffect` to ensure cleanup of event listeners on component unmount.
 */
const MonroeSidebar = () => {
  const location = useLocation()
  const pathname = location.pathname
  const { setShowOperatorScreen } = useUserSlice()
  const isPageThatWillHaveChanges =
    [PATH_TO_CREATE_LEAGUE].includes(pathname) ||
    pathname.includes(PATH_TO_EDIT_LEAGUE) ||
    pathname.includes(PATH_TO_EDIT_EVENT) ||
    pathname.includes(PATH_TO_LOCATIONS_EDIT) ||
    pathname.includes(PATH_TO_CREATE_SEASON) ||
    pathname.includes(PATH_TO_EDIT_SEASON) ||
    pathname.includes(PATH_TO_CREATE_USER) ||
    pathname.includes(PATH_TO_EDIT_USER) ||
    pathname.includes(PATH_TO_EDIT_MASTER_TEAM) ||
    pathname.includes(PATH_TO_CREATE_MASTER_TEAM) ||
    pathname.includes(PATH_TO_CREATE_LEAGUE_TEAM) ||
    pathname.includes(PATH_TO_EDIT_LEAGUE_TEAM)
  const isLeagueTournamentPage = pathname.includes(PATH_TO_LEAGUES)
  const isSeasonsPage = pathname.includes(PATH_TO_SEASONS)
  const isUsersPage = pathname.includes(PATH_TO_USERS)
  const isMasterTeamsPage = pathname.includes(PATH_TO_MASTER_TEAMS)
  const isLeagueTeamsPage = pathname.includes(PATH_TO_LEAGUE_TEAMS)
  const isLocationsPage = pathname.includes(PATH_TO_LOCATIONS)
  const isEventsPage = pathname.includes(PATH_TO_EVENTS)

  const { setIsCreateBracketPage, setSelectedBracketId } = useSeasonSlice()

  /**
   * Determines the selected sub-menu key based on the current page's path or context.
   *
   * @function
   * @returns {string} The key representing the selected sub-menu. Returns an empty string if no match is found.
   */
  const getSelectedSubMenu = (): string => {
    if ([PATH_TO_MASTER_TEAMS, PATH_TO_LEAGUE_TEAMS].includes(pathname)) return TEAMS_KEY

    if (isLeagueTournamentPage || isSeasonsPage) return LEAGUE_AND_TOURN_KEY
    if (isUsersPage) return USERS_KEY
    if (isMasterTeamsPage) return TEAMS_KEY
    if (isLeagueTeamsPage) return TEAMS_KEY
    if (isLocationsPage) return LOCATIONS_KEY
    if (isEventsPage) return EVENTS_KEY

    if ([PATH_TO_PLAYOFF_FORMAT, PATH_TO_STANDINGS_FORMAT, PATH_TO_TIEBREAKERS].includes(pathname))
      return STANDINGS_DISPLAY_KEY

    return ''
  }

  /**
   * Determines the default selected keys based on the current page context.
   *
   * @return {string} The path corresponding to the current page or an empty string if no match is found.
   */
  const getDefaultSelectedKeys = () => {
    if (isUsersPage) return PATH_TO_USERS
    if (isLeagueTournamentPage) return PATH_TO_LEAGUES
    if (isSeasonsPage) return PATH_TO_SEASONS
    if (isMasterTeamsPage) return PATH_TO_MASTER_TEAMS
    if (isLeagueTeamsPage) return PATH_TO_LEAGUE_TEAMS
    if (isLocationsPage) return PATH_TO_LOCATIONS
    if (isEventsPage) return PATH_TO_EVENTS

    return ''
  }

  const getIconColor = (selected: boolean) => selected ? colors.primary : colors.secondaryText

  const MENU_ITEMS: TMenuItem[] = [
    {
      key: PATH_TO_USERS,
      label: <Link disableHover to={PATH_TO_USERS}>Users</Link>,
      icon: <SVGIcon color={getIconColor(isUsersPage)} src={UserIcon} />,
    },
    {
      key: TEAMS_KEY,
      label: 'Teams',
      icon: <SVGIcon src={TeamsIcon} />,
      children: [
        {
          key: PATH_TO_MASTER_TEAMS,
          label: <Link disableHover to={PATH_TO_MASTER_TEAMS}>Master Teams</Link>,
        },
        {
          key: PATH_TO_LEAGUE_TEAMS,
          label: <Link disableHover to={PATH_TO_LEAGUE_TEAMS}>League Teams</Link>,
        },
      ],
    },
    {
      key: LEAGUE_AND_TOURN_KEY,
      label: 'League & Tourn',
      icon: <SVGIcon src={LeagueIcon} />,
      children: [
        {
          key: PATH_TO_LEAGUES,
          label: <Link disableHover to={PATH_TO_LEAGUES}>League & Tourn</Link>,
        },
        {
          key: PATH_TO_SEASONS,
          label: <Link disableHover to={PATH_TO_SEASONS}>Seasons</Link>,
        },
      ],
    },
    // {
    //   key: STANDINGS_DISPLAY_KEY,
    //   label: 'Standings Display',
    //   icon: <ReactSVG src={StandingsIcon} />,
    //   children: [
    //     {
    //       key: PATH_TO_PLAYOFF_FORMAT,
    //       label: 'Playoff Format',
    //       onClick: () => navigateTo(PATH_TO_PLAYOFF_FORMAT),
    //     },
    //     {
    //       key: PATH_TO_STANDINGS_FORMAT,
    //       label: 'Standings Format',
    //       onClick: () => navigateTo(PATH_TO_STANDINGS_FORMAT),
    //     },
    //     { key: PATH_TO_TIEBREAKERS, label: 'Tiebreakers', onClick: () => navigateTo(PATH_TO_TIEBREAKERS) },
    //   ],
    // },
    {
      key: PATH_TO_EVENTS,
      label: <Link disableHover to={PATH_TO_EVENTS}>Events</Link>,
      icon: (
        <SVGIcon color={getIconColor(isEventsPage)} src={ScheduleIcon} />
      ),
    },
    {
      key: PATH_TO_LOCATIONS,
      label: <Link disableHover to={PATH_TO_LOCATIONS}>Locations</Link>,
      icon: (
        <SVGIcon color={getIconColor(isLocationsPage)} src={MapIcon} />
      ),
    },
    // {
    //   key: PATH_TO_GROUPS,
    //   label: 'Groups',
    //   icon: (
    //     <ReactSVG
    //       className={location.pathname === PATH_TO_GROUPS ? 'red-icon' : ''}
    //       src={GroupsIcon}
    //
    //     />
    //   ),
    //   onClick: () => navigateTo(PATH_TO_GROUPS),
    // },
  ]

  /**
   * Handles the `beforeunload` event to prevent accidental navigation
   * or tab closure on specific pages with potential unsaved changes.
   *
   * @param {BeforeUnloadEvent} e - The event triggered before the page unloads.
   */
  const handleBeforeUnloadEvent = (e: BeforeUnloadEvent) => {
    if (isPageThatWillHaveChanges) e.preventDefault()

    setIsCreateBracketPage(false)
    setSelectedBracketId(null)
    setShowOperatorScreen(false)
  }

  /**
   * Adds an event listener for the 'beforeunload' event on the window object,
   * and removes it when the returned function is invoked. This can be used to
   * handle actions before the page is unloaded or refreshed.
   *
   * @returns A cleanup function to remove the 'beforeunload' event listener.
   */
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnloadEvent)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadEvent)
    }
  }, [])

  return (
    <Sider width="256px" style={siderStyle}>
      <Companies>
        <CompanyMenu
          mode="inline"
          className="company-menu"
          items={COMPANY_MENU_ITEMS}
        />
      </Companies>

      <Divider />

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

// Styled components
const Companies = styled(Flex)`
    margin-top: 4px;
    padding: 0 12px;
    & .company-menu .ant-menu-submenu.ant-menu-submenu-inline{
        margin: 0;
    }
    & .company-menu .ant-menu-submenu-arrow {
        right: 18px
    }
`
const CompanyMenu = styled(Menu)`
   border: none !important;
`
