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

