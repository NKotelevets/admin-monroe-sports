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
