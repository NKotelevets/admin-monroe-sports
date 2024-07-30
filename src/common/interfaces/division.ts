export interface IBEDivision {
  created_at: string
  description: string
  id: string
  name: string
  sub_division: {
    name: string
    description: string
  }
  updated_at: string
}

export interface IFEDivision {
  name: string
  description: string
  subDivision: IFESubdivision[]
}

export interface IFESubdivision {
  name: string
  description: string
  playoffFormat: string
  standingsFormat: string
  tiebreakersFormat: string
}
