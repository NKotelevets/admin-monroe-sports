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

export type Gender = "Male" | "Female";

export interface GenderDropdownI {
  id: number;
  value: Gender;
}

export interface AvailabilityDataI {
  id: number;
  teamLogo: string;
  teamName: string;
  league: string;
  season: string;
}

// interfaces for userLogin request
export interface LoginRequestParamsI {
  email: string;
  password: string;
}
export interface LoginResponseDataI {
  access: string;
  refresh: string;
}

// interfaces for userRefreshToken request
export interface RefreshTokenRequestParamsI {
  token: string;
}
export interface RefreshTokenResponseDataI {
  access: string;
}

// interfaces for userCheckEmail request
export interface CheckEmailRequestParamsI {
  email: string;
}
export interface CheckEmailResponseDataI {
  exists: boolean;
}

// interfaces for userRegister request
export interface RegisterRequestParamsI {
  email: string;
  password: string;
  invite_id?: string;
  photo_s3_url?: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  phone_number?: string;
  zip_code: string;
  gender: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}
export interface RegisterResponseDataI {
  tokens: {
    access: string;
    refresh: string;
  };
  user_id: string;
  invitation: {
    id: string;
    email: string;
    invite_type: number;
    team: {
      id: string;
      name: string;
    };
  };
}
