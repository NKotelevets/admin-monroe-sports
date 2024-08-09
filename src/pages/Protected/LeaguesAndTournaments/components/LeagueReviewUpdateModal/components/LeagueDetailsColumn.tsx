import { Flex, Typography } from 'antd'
import { CSSProperties, FC } from 'react'

import TagType from '@/pages/Protected/LeaguesAndTournaments/components/TagType'

import { IFELeague } from '@/common/interfaces/league'

const currentContainerStyle: CSSProperties = {
  borderRight: '2px solid #F4F4F5',
  paddingRight: '16px',
}

const newContainerStyle: CSSProperties = {
  paddingLeft: '16px',
}

const titleStyle: CSSProperties = {
  color: '#888791',
  fontSize: '12px',
  marginBottom: '8px',
}

const getItemTitleStyle = (isChanged: boolean | undefined): CSSProperties => ({
  marginBottom: '4px',
  marginRight: '20px',
  color: isChanged ? 'rgba(26, 22, 87, 0.85)' : '#888791',
  fontWeight: 500,
})

const getItemValueStyle = (isChanged: boolean | undefined): CSSProperties => ({
  color: isChanged ? '#333' : '#888791',
})

const itemContainerStyle: CSSProperties = {
  marginBottom: '16px',
}

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
  <Flex flex="1 1 50%" vertical style={isNew ? newContainerStyle : currentContainerStyle}>
    <Typography.Text style={titleStyle}>{title}</Typography.Text>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(difference['name'])}>Name:</Typography.Text>
      <Typography.Text style={getItemValueStyle(difference['name'])}>{name}</Typography.Text>
    </Flex>

    <Flex style={itemContainerStyle} align="center">
      <Typography.Text style={getItemTitleStyle(difference['type'])}>Type:</Typography.Text>
      <TagType text={type} />
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text
        style={getItemTitleStyle(difference['playoffFormat']) || getItemTitleStyle(difference['playoffsTeams'])}
      >
        Default playoff format:
      </Typography.Text>
      <Typography.Text
        style={getItemValueStyle(difference['playoffFormat']) || getItemValueStyle(difference['playoffsTeams'])}
      >
        {playoffFormat === 'Best Record Wins' ? playoffFormat : `${playoffFormat} (${playoffsTeams} playoffs’ teams)`}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(difference['standingsFormat'])}>
        Default standings format:
      </Typography.Text>
      <Typography.Text style={getItemValueStyle(difference['standingsFormat'])}>{standingsFormat}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(difference['tiebreakersFormat'])}>Tiebreakers format:</Typography.Text>
      <Typography.Text style={getItemValueStyle(difference['tiebreakersFormat'])}>{tiebreakersFormat}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(difference['description'])}>Description:</Typography.Text>
      <Typography.Text style={getItemValueStyle(difference['description'])}>{description}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(difference['welcomeNote'])}>Welcome Note:</Typography.Text>
      <Typography.Text style={getItemValueStyle(difference['welcomeNote'])}>{welcomeNote}</Typography.Text>
    </Flex>
  </Flex>
)

export default LeagueDetailsColumn
