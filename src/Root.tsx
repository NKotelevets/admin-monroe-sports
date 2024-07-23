import { Route, Routes } from 'react-router-dom'

import SignIn from '@/pages/Auth/SingIn'
import LeaguesAndTournaments from '@/pages/Protected/LeaguesAndTournaments'
import CreateLeague from '@/pages/Protected/LeaguesAndTournaments/CreateLeague'
import EditLeague from '@/pages/Protected/LeaguesAndTournaments/EditLeague'
import LeagueDetails from '@/pages/Protected/LeaguesAndTournaments/LeagueDetails'
import LeaguesDeletingInfo from '@/pages/Protected/LeaguesAndTournaments/LeaguesDeletingInfo'
import LeaguesImportInfo from '@/pages/Protected/LeaguesAndTournaments/LeaguesImportInfo'
import Seasons from '@/pages/Protected/Seasons'
import CreateSeason from '@/pages/Protected/Seasons/CreateSeason'
import EditSeason from '@/pages/Protected/Seasons/EditSeason'
import { SeasonDetails } from '@/pages/Protected/Seasons/SeasonDetails'
import SeasonsDeletingInfo from '@/pages/Protected/Seasons/SeasonsDeletingInfo'
import SeasonsImportInfo from '@/pages/Protected/Seasons/SeasonsImportInfo'

import InfoAlert from '@/components/InfoAlert'
import Notification from '@/components/Notification'

import AuthProvider from '@/utils/AuthProvider'

import {
  PATH_TO_CREATE_LEAGUE_TOURNAMENT,
  PATH_TO_EDIT_LEAGUE_TOURNAMENT,
  PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE,
  PATH_TO_LEAGUE_TOURNAMENT_DELETING_INFO,
  PATH_TO_LEAGUE_TOURNAMENT_IMPORT_INFO,
  PATH_TO_LEAGUE_TOURNAMENT_PAGE,
  PATH_TO_SEASONS_CREATE,
  PATH_TO_SEASONS_DELETING_INFO,
  PATH_TO_SEASONS_DETAILS,
  PATH_TO_SEASONS_EDIT_DETAILS,
  PATH_TO_SEASONS_IMPORT_INFO,
  PATH_TO_SEASONS_PAGE,
  PATH_TO_SIGN_IN_PAGE,
} from '@/constants/paths'

const Root = () => (
  <AuthProvider>
    <Notification />
    <InfoAlert />

    <Routes>
      <Route path={PATH_TO_SIGN_IN_PAGE} element={<SignIn />} />

      {/* LEAGUES & TOURNAMENTS PAGES */}
      <Route path={PATH_TO_CREATE_LEAGUE_TOURNAMENT} element={<CreateLeague />} />
      <Route path={`${PATH_TO_EDIT_LEAGUE_TOURNAMENT}/:id`} element={<EditLeague />} />
      <Route path={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE} element={<LeaguesAndTournaments />} />
      <Route path={`${PATH_TO_LEAGUE_TOURNAMENT_PAGE}/:id`} element={<LeagueDetails />} />
      <Route path={PATH_TO_LEAGUE_TOURNAMENT_IMPORT_INFO} element={<LeaguesImportInfo />} />
      <Route path={PATH_TO_LEAGUE_TOURNAMENT_DELETING_INFO} element={<LeaguesDeletingInfo />} />

      {/* SEASONS PAGES */}
      <Route path={PATH_TO_SEASONS_PAGE} element={<Seasons />} />
      <Route path={PATH_TO_SEASONS_DELETING_INFO} element={<SeasonsDeletingInfo />} />
      <Route path={PATH_TO_SEASONS_IMPORT_INFO} element={<SeasonsImportInfo />} />
      <Route path={PATH_TO_SEASONS_CREATE} element={<CreateSeason />} />
      <Route path={`${PATH_TO_SEASONS_DETAILS}/:id`} element={<SeasonDetails />} />
      <Route path={`${PATH_TO_SEASONS_EDIT_DETAILS}/:id`} element={<EditSeason />} />
    </Routes>
  </AuthProvider>
)

export default Root
