import Typography from 'antd/es/typography'
import * as Yup from 'yup'

import { PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE } from '@/constants/paths'

import { IFECreateLeagueBody } from '@/common/interfaces/league'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.number().required('Type is required'),
  description: Yup.string(),
  welcomeNote: Yup.string(),
  playoffFormat: Yup.number().required('Default Playoff Format is required'),
  standingsFormat: Yup.number().required('Default Standings Format is required'),
  tiebreakersFormat: Yup.number().required('Default Tiebreakers Format is required'),
})

export const initialFormValues: IFECreateLeagueBody = {
  description: '',
  welcomeNote: '',
  name: '',
  type: 0,
  playoffFormat: 0,
  standingsFormat: 0,
  tiebreakersFormat: 0,
  playoffsTeams: 4,
}

export const BREAD_CRUMB_ITEMS = [
  {
    title: <a href={PATH_TO_LEAGUES_AND_TOURNAMENTS_PAGE}>League & Tourn</a>,
  },
  {
    title: (
      <Typography.Text
        style={{
          color: 'rgba(26, 22, 87, 0.85)',
          fontWeight: 500,
        }}
      >
        Create League/Tournament
      </Typography.Text>
    ),
  },
]

export const DEFAULT_STANDING_FORMAT_WINNING_TOOLTIP = (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <p>Wins (info only) </p>
    <p>Losses (info only) </p>
    <p>Winning %</p>
  </div>
)

export const DEFAULT_STANDING_FORMAT_POINTS_TOOLTIP = (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <p>Wins</p>
    <p>Losses</p>
    <p>Draws</p>
    <p>Points (3 for a win, 1 for a draw, 0 for a loss)</p>
    <p>Goals For [GF]</p>
    <p>Goals Against [GA]</p>
    <p>Goal Differential [GD]</p>
  </div>
)

export const DEFAULT_TIEBREAKERS_FORMAT_WINNING_TOOLTIP = (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <p>Head to Head (Winning % between all teams)</p>
    <p>Winning % vs common opponents</p>
    <p>Winning % vs all subdivision teams</p>
    <p>Winning % vs all division teams</p>
  </div>
)

export const DEFAULT_TIEBREAKERS_FORMAT_POINTS_TOOLTIP = (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <p>Head to Head</p>
    <p>Goal Differential</p>
    <p>Goals Allowed</p>
  </div>
)
