import { Route, Routes } from 'react-router-dom'

import SignIn from '@/pages/Auth/SingIn'
import Events from '@/pages/Protected/Events'
import LeaguesAndTournaments from '@/pages/Protected/LeaguesAndTournaments'
import CreateLeague from '@/pages/Protected/LeaguesAndTournaments/CreateLeague'
import EditLeague from '@/pages/Protected/LeaguesAndTournaments/EditLeague'
import LeagueDetails from '@/pages/Protected/LeaguesAndTournaments/LeagueDetails'
import LeaguesDeletingInfo from '@/pages/Protected/LeaguesAndTournaments/LeaguesDeletingInfo'
import LeaguesImportInfo from '@/pages/Protected/LeaguesAndTournaments/LeaguesImportInfo'
import MasterTeams from '@/pages/Protected/MasterTeams'
import CreateMasterTeam from '@/pages/Protected/MasterTeams/CreateMasterTeams'
import MasterTeamDetails from '@/pages/Protected/MasterTeams/MasterTeamDetails'
import MasterTeamsDeletingInfo from '@/pages/Protected/MasterTeams/MasterTeamsDeletingInfo'
import Seasons from '@/pages/Protected/Seasons'
import CreateSeason from '@/pages/Protected/Seasons/CreateSeason'
import EditSeason from '@/pages/Protected/Seasons/EditSeason'
import { SeasonDetails } from '@/pages/Protected/Seasons/SeasonDetails'
import SeasonsDeletingInfo from '@/pages/Protected/Seasons/SeasonsDeletingInfo'
import SeasonsImportInfo from '@/pages/Protected/Seasons/SeasonsImportInfo'
import Users from '@/pages/Protected/Users'
import BlockingInfo from '@/pages/Protected/Users/BlockingInfo'
import CreateUser from '@/pages/Protected/Users/CreateUser'
import EditUser from '@/pages/Protected/Users/EditUser'
import OperatorOnboarding from '@/pages/Protected/Users/OperatorOnboarding'
import UserDetails from '@/pages/Protected/Users/UserDetails'
import UsersBulkEdit from '@/pages/Protected/Users/UsersBulkEdit'
import UsersImportInfo from '@/pages/Protected/Users/UsersImportInfo'

import InfoAlert from '@/components/InfoAlert'
import Notification from '@/components/Notification'

import AuthProvider from '@/utils/AuthProvider'

import {
  PATH_TO_CREATE_LEAGUE,
  PATH_TO_CREATE_MASTER_TEAM,
  PATH_TO_CREATE_SEASON,
  PATH_TO_CREATE_USER,
  PATH_TO_DELETING_INFO_MASTER_TEAMS,
  PATH_TO_EDIT_LEAGUE,
  PATH_TO_EDIT_SEASON,
  PATH_TO_EDIT_USER,
  PATH_TO_EVENTS,
  PATH_TO_LEAGUES,
  PATH_TO_LEAGUES_DELETING_INFO,
  PATH_TO_LEAGUES_IMPORT_INFO,
  PATH_TO_LEAGUE_PAGE,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_OPERATOR_ONBOARDING,
  PATH_TO_SEASONS,
  PATH_TO_SEASONS_DELETING_INFO,
  PATH_TO_SEASONS_IMPORT_INFO,
  PATH_TO_SEASON_DETAILS,
  PATH_TO_SIGN_IN,
  PATH_TO_USERS,
  PATH_TO_USERS_BLOCKING_INFO,
  PATH_TO_USERS_BULK_EDIT,
  PATH_TO_USERS_IMPORT_INFO,
} from '@/constants/paths'

const Root = () => (
  <AuthProvider>
    <Notification />
    <InfoAlert />

    <Routes>
      <Route path={PATH_TO_SIGN_IN} element={<SignIn />} />

      {/* LEAGUES & TOURNAMENTS PAGES */}
      <Route path={PATH_TO_CREATE_LEAGUE} element={<CreateLeague />} />
      <Route path={`${PATH_TO_EDIT_LEAGUE}/:id`} element={<EditLeague />} />
      <Route path={PATH_TO_LEAGUES} element={<LeaguesAndTournaments />} />
      <Route path={`${PATH_TO_LEAGUE_PAGE}/:id`} element={<LeagueDetails />} />
      <Route path={PATH_TO_LEAGUES_IMPORT_INFO} element={<LeaguesImportInfo />} />
      <Route path={PATH_TO_LEAGUES_DELETING_INFO} element={<LeaguesDeletingInfo />} />

      {/* SEASONS PAGES */}
      <Route path={PATH_TO_SEASONS} element={<Seasons />} />
      <Route path={PATH_TO_SEASONS_DELETING_INFO} element={<SeasonsDeletingInfo />} />
      <Route path={PATH_TO_SEASONS_IMPORT_INFO} element={<SeasonsImportInfo />} />
      <Route path={PATH_TO_CREATE_SEASON} element={<CreateSeason />} />
      <Route path={`${PATH_TO_SEASON_DETAILS}/:id`} element={<SeasonDetails />} />
      <Route path={`${PATH_TO_EDIT_SEASON}/:id`} element={<EditSeason />} />

      {/* Users */}
      <Route path={PATH_TO_USERS} element={<Users />} />
      <Route path={`${PATH_TO_USERS}/:id`} element={<UserDetails />} />
      <Route path={PATH_TO_CREATE_USER} element={<CreateUser />} />
      <Route path={`${PATH_TO_EDIT_USER}/:id`} element={<EditUser />} />
      <Route path={PATH_TO_USERS_BULK_EDIT} element={<UsersBulkEdit />} />
      <Route path={PATH_TO_USERS_BLOCKING_INFO} element={<BlockingInfo />} />
      <Route path={PATH_TO_USERS_IMPORT_INFO} element={<UsersImportInfo />} />
      <Route path={`${PATH_TO_OPERATOR_ONBOARDING}/:id`} element={<OperatorOnboarding />} />

      {/* Master Teams */}
      <Route path={PATH_TO_MASTER_TEAMS} element={<MasterTeams />} />
      <Route path={`${PATH_TO_MASTER_TEAMS}/:id`} element={<MasterTeamDetails />} />
      <Route path={PATH_TO_DELETING_INFO_MASTER_TEAMS} element={<MasterTeamsDeletingInfo />} />
      <Route path={PATH_TO_CREATE_MASTER_TEAM} element={<CreateMasterTeam />} />

      {/* Events */}
      <Route path={PATH_TO_EVENTS} element={<Events />} />
    </Routes>
  </AuthProvider>
)

export default Root
