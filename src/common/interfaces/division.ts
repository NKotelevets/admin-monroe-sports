interface IBESubdivision {
  id?: string
  name: string
  description: string
  playoff_format: number
  standings_format: number
  tiebreakers_format: number
}

export interface IFESubdivision {
  name: string
  description: string
  playoffFormat: string
  standingsFormat: string
  tiebreakersFormat: string
}

export interface IBEDivision {
  id: string
  name: string
  description: string
  sub_division: IBESubdivision[]
  created_at?: string
  updated_at?: string
}

export interface IFEDivision {
  name: string
  description: string
  subdivisions: IFESubdivision[]
}
