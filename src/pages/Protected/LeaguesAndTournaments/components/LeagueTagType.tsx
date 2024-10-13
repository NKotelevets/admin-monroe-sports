import styled from '@emotion/styled'
import Space from 'antd/es/space'
import { FC } from 'react'

import { MonroeErrorText, MonroeLightBlueText } from '@/components/Elements'

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
        <MonroeLightBlueText>{text}</MonroeLightBlueText>
      </TournamentTag>
    ) : (
      <LeagueTag>
        <MonroeErrorText>{text}</MonroeErrorText>
      </LeagueTag>
    )}
  </>
)

export default LeagueTagType
