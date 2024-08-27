import styled from '@emotion/styled'
import Space from 'antd/es/space'
import Typography from 'antd/es/typography'
import { FC } from 'react'

const TournamentTag = styled(Space)`
  border: 1px solid #a49eff;
  background-color: #f1f0ff;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px;
`

const LeagueTag = styled(Space)`
  border: 1px solid #ff594d;
  background-color: #fff1f0;
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px;
`

const LeagueTagType: FC<{ text: string }> = ({ text }) => (
  <>
    {text === 'Tourn' || text === 'Tournament' ? (
      <TournamentTag>
        <Typography
          style={{
            color: '#4C41E6',
          }}
        >
          {text}
        </Typography>
      </TournamentTag>
    ) : (
      <LeagueTag>
        <Typography
          style={{
            color: '#BC261B',
          }}
        >
          {text}
        </Typography>
      </LeagueTag>
    )}
  </>
)

export default LeagueTagType
