export const PATH_TO_SIGN_IN = '/sign-in'

export const PATH_TO_HOME = '/'

export const PATH_TO_DOWNLOAD_SCREEN = '/download-the-app'
export const PATH_TO_TERMS = '/terms-of-use'
export const PATH_TO_PRIVACY = '/privacy-policy'

// PUBLIC ACCOUNT PAGES
export const PATH_TO_ACCOUNT_LOGIN = '/accounts/login'
export const PATH_TO_ACCOUNT_SIGNUP = '/accounts/signup'
export const PATH_TO_ACCOUNT_REQUEST_RESET_PASSWORD = '/accounts/request-reset-password'
export const PATH_TO_ACCOUNT_RESET_PASSWORD = '/accounts/reset-password'
export const PATH_TO_ACCOUNT_INVITATIONS = '/accounts/invitations'
export const PATH_TO_ACCOUNT_INVITE_PARENT = '/accounts/invite-parent'
export const PATH_TO_ACCOUNT_INVITATION_EXPIRED = '/accounts/invitation-expired'
export const PATH_TO_ACCOUNT_INVITATION_ERROR = '/accounts/invitation-error'

// ONBOARDING PAGES
export const PATH_TO_ACCOUNT_ONBOARDING = '/accounts/onboarding'
export const PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_DATA = '/accounts/onboarding/confirm-data'
export const PATH_TO_ACCOUNT_ONBOARDING_CONFIRM_PLAYER_DATA = '/accounts/onboarding/confirm-player-data'
export const PATH_TO_ACCOUNT_ONBOARDING_CREATE_PASSWORD = '/accounts/onboarding/create-password'
export const PATH_TO_ACCOUNT_ONBOARDING_INVITATION = '/accounts/invitation'
export const PATH_TO_ACCOUNT_ONBOARDING_INVITE_PARENT = '/accounts/invite-parent'
export const PATH_TO_ACCOUNT_ONBOARDING_SIGNUP = PATH_TO_ACCOUNT_SIGNUP


// LEAGUES & TOURNAMENTS PAGES
export const PATH_TO_LEAGUES = '/leagues-and-tournaments'
export const PATH_TO_LEAGUE_PAGE = '/leagues-and-tournaments'
export const PATH_TO_CREATE_LEAGUE = '/leagues-and-tournaments/create'
export const PATH_TO_EDIT_LEAGUE = '/leagues-and-tournaments/edit'
export const PATH_TO_LEAGUES_IMPORT_INFO = '/leagues-and-tournaments/import-info'
export const PATH_TO_LEAGUES_DELETING_INFO = '/leagues-and-tournaments/deleting-info'

// SEASONS PAGES
export const PATH_TO_SEASONS = '/seasons'
export const PATH_TO_SEASON_DETAILS = '/seasons'
export const PATH_TO_CREATE_SEASON = '/seasons/create'
export const PATH_TO_EDIT_SEASON = '/seasons/edit'
export const PATH_TO_SEASONS_DELETING_INFO = '/seasons/deleting-info'
export const PATH_TO_SEASONS_IMPORT_INFO = '/seasons/import-info'

// USERS PAGES
export const PATH_TO_USERS = '/users'
export const PATH_TO_CREATE_USER = '/users/create'
export const PATH_TO_EDIT_USER = '/users/edit'
export const PATH_TO_USERS_BULK_EDIT = '/users/bulk-edit'
export const PATH_TO_USERS_BLOCKING_INFO = '/users/blocking-info'
export const PATH_TO_USERS_IMPORT_INFO = '/users/import-info'
export const PATH_TO_OPERATOR_ONBOARDING = '/users/operator-onboarding'
export const PATH_TO_BULK_EDIT_USER_ERRORS = '/users/bulk-edit-errors'

// MASTER TEAMS
export const PATH_TO_MASTER_TEAMS = '/master-teams'
export const PATH_TO_CREATE_MASTER_TEAM = '/master-teams/create'
export const PATH_TO_EDIT_MASTER_TEAM = '/master-teams/edit'
export const PATH_TO_DELETING_INFO_MASTER_TEAMS = '/master-teams/deleting-info'
export const PATH_TO_MASTER_TEAMS_IMPORT_INFO = '/master-teams/import-info'
export const PATH_TO_MASTER_TEAM_SCHEDULE_REQUEST = '/master-teams/schedule-request'

// LEAGUE TEAMS
export const PATH_TO_LEAGUE_TEAMS = '/league-teams'
export const PATH_TO_CREATE_LEAGUE_TEAM = '/league-teams/create'
export const PATH_TO_EDIT_LEAGUE_TEAM = '/league-teams/edit'
export const PATH_TO_DELETE_INFO_LEAGUE_TEAM = '/league-teams/delete-info'
export const PATH_TO_LEAGUE_TEAM_IMPORT_INFO = '/league-teams/import-info'
export const PATH_TO_LEAGUE_TEAM_SCHEDULE_REQUEST = '/league-teams/schedule-request'

// EVENTS
export const PATH_TO_EVENTS = '/events'
export const PATH_TO_CREATE_EVENT = '/events/create'
export const PATH_TO_EDIT_EVENT = '/events/edit'
export const PATH_TO_DELETE_INFO_EVENTS = '/events/delete-info'
export const PATH_TO_EVENTS_IMPORT_INFO = '/events/import-info'
export const PATH_TO_BULK_EDIT_EVENT = '/events/bulk-edit'

// LOCATIONS
export const PATH_TO_LOCATIONS = '/locations'
export const PATH_TO_LOCATIONS_CREATE = '/locations/create'
export const PATH_TO_LOCATIONS_EDIT = '/locations/edit'
export const PATH_TO_LOCATIONS_IMPORT_INFO = '/locations/import-info'
export const PATH_TO_LOCATIONS_DELETE_INFO = '/locations/delete-info'

// REST
export const PATH_TO_PLAYOFF_FORMAT = '/playoff-format'
export const PATH_TO_STANDINGS_FORMAT = '/standings-format'
export const PATH_TO_TIEBREAKERS = '/tiebreakers'
export const PATH_TO_GROUPS = '/groups'

export const PROTECTED_PAGES = [
  PATH_TO_LEAGUES,
  PATH_TO_USERS,
  PATH_TO_MASTER_TEAMS,
  PATH_TO_LEAGUE_TEAMS,
  PATH_TO_SEASONS,
  PATH_TO_PLAYOFF_FORMAT,
  PATH_TO_STANDINGS_FORMAT,
  PATH_TO_TIEBREAKERS,
  PATH_TO_EVENTS,
  PATH_TO_GROUPS,
  PATH_TO_ACCOUNT_INVITATIONS
]

export const AUTH_PAGES = [PATH_TO_SIGN_IN, PATH_TO_ACCOUNT_LOGIN]
