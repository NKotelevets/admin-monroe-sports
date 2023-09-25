export interface SvgPropsI {
  fill?: string;
  stroke?: string;
  class?: string;
  hovered?: boolean;
}

export enum NavigationItemTitles {
  home = "Home",
  availability = "Availability",
  teams = "Teams",
  games = "Games",
  roles = "Roles",
}

export interface AvailabilityDataI {
  id: number;
  teamLogo: string;
  teamName: string;
  league: string;
  season: string;
}

export interface LoginRequestParamsI {
  email: string;
  password: string;
}
export interface LoginResponseDataI {
  access: string;
  refresh: string;
}

export interface RefreshTokenRequestParamsI {
  token: string;
}

export interface RefreshTokenResponseDataI {
  access: string;
}

// interfaces for userStartResetPassword request
export interface StartResetPasswordRequestParamsI {
  email: string;
}

export interface StartResetPasswordResponseDataI {
  code: string;
  details: string;
}

// interfaces for userFinishResetPassword request
export interface FinishResetPasswordRequestParamsI {
  token: string;
  new_password: string;
}

export interface FinishResetPasswordResponseDataI {
  code: string;
  details: string;
}
