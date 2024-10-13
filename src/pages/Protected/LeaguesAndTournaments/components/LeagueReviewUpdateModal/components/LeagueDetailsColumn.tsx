import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import { FC } from 'react'

import LeagueTagType from '@/pages/Protected/LeaguesAndTournaments/components/LeagueTagType'

import { IFELeague } from '@/common/interfaces/league'

const Container = styled(Flex)<{ is_new: string }>`
  flex: 1 1 50%;
  flex-direction: column;
  border-right: ${(props) => (props.is_new === 'true' ? '0' : '2px solid #F4F4F5')};
  padding-left: ${(props) => (props.is_new === 'true' ? '0' : '16px')};
  padding-right: ${(props) => (props.is_new === 'true' ? '16px' : '0')};
`

const Title = styled(Typography)`
  color: #888791;
  font-size: 12px;
  margin-bottom: 8px;
`

const ItemTitle = styled(Typography)<{ is_changed: string }>`
  margin-bottom: 4px;
  margin-right: 20px;
  color: ${({ is_changed }) => (is_changed === 'true' ? 'rgba(26, 22, 87, 0.85)' : '#888791')};
  font-weight: 500;
`

const ItemValueStyle = styled(Typography)<{ is_changed: string }>`
  color: ${({ is_changed }) => (is_changed === 'true' ? '#333' : '#888791')};
`

interface ILeagueDetailsColumnProps {
  title: string
  name: string
  type: string
  playoffFormat: string
  standingsFormat: string
  tiebreakersFormat: string
  description: string
  welcomeNote: string
  isNew: boolean
  difference: Record<Partial<keyof IFELeague>, boolean>
  playoffsTeams: number
}

const LeagueDetailsColumn: FC<ILeagueDetailsColumnProps> = ({
  title,
  name,
  type,
  playoffFormat,
  standingsFormat,
  tiebreakersFormat,
  description,
  welcomeNote,
  isNew,
  difference,
  playoffsTeams,
}) => (
  <Container is_new={`${isNew}`}>
    <Title>{title}</Title>

    <Flex vertical className="mg-b16">
      <ItemTitle is_changed={`${!!difference['name']}`}>Name:</ItemTitle>
      <ItemValueStyle is_changed={`${!!difference['name']}`}>{name}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" align="center">
      <ItemTitle is_changed={`${!!difference['type']}`}>Type:</ItemTitle>
      <LeagueTagType text={type} />
    </Flex>

    <Flex vertical className="mg-b16">
      <ItemTitle is_changed={`${!!difference['playoffFormat'] || !!difference['playoffsTeams']}`}>
        Default playoff format:
      </ItemTitle>
      <ItemValueStyle is_changed={`${!!difference['playoffFormat'] || !!difference['playoffsTeams']}`}>
        {playoffFormat === 'Best Record Wins' ? playoffFormat : `${playoffFormat} (${playoffsTeams} playoffs’ teams)`}
      </ItemValueStyle>
    </Flex>

    <Flex vertical className="mg-b16">
      <ItemTitle is_changed={`${!!difference['standingsFormat']}`}>Default standings format:</ItemTitle>
      <ItemValueStyle is_changed={`${!!difference['standingsFormat']}`}>{standingsFormat}</ItemValueStyle>
    </Flex>

    <Flex vertical className="mg-b16">
      <ItemTitle is_changed={`${!!difference['tiebreakersFormat']}`}>Tiebreakers format:</ItemTitle>
      <ItemValueStyle is_changed={`${!!difference['tiebreakersFormat']}`}>{tiebreakersFormat}</ItemValueStyle>
    </Flex>

    <Flex vertical className="mg-b16">
      <ItemTitle is_changed={`${!!difference['description']}`}>Description:</ItemTitle>
      <ItemValueStyle is_changed={`${!!difference['description']}`}>{description}</ItemValueStyle>
    </Flex>

    <Flex vertical className="mg-b16">
      <ItemTitle is_changed={`${!!difference['welcomeNote']}`}>Welcome Note:</ItemTitle>
      <ItemValueStyle is_changed={`${!!difference['welcomeNote']}`}>{welcomeNote}</ItemValueStyle>
    </Flex>
  </Container>
)

export default LeagueDetailsColumn
