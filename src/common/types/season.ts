import { IMatch } from '@/common/interfaces/bracket.ts'

export type TPopulateBracketsBody = {
  id: number
  name: string
  division: string[]
  number_of_teams: number
  matches: IMatch[]
  published: true
  ignore_feature_games?: boolean
  ignore_future_games?: boolean
  ignore_noscore_games?: boolean
}
