import { Flex, Typography } from 'antd'
import { CSSProperties, FC } from 'react'

import { ISeasonReviewUpdateData } from '@/common/interfaces/season'

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

interface ISeasonDetailsColumn extends ISeasonReviewUpdateData {
  title: string;
  isNew: boolean;
  differences: Record<keyof ISeasonReviewUpdateData, boolean>;
}

const SeasonDetailsColumn: FC<ISeasonDetailsColumn> = ({
  differences,
  expectedEndDate,
  isNew,
  linkedLeagueName,
  name,
  playoffFormat,
  standingsFormat,
  startDate,
  tiebreakersFormat,
  title,
}) => (
  <Flex
    flex="1 1 50%"
    vertical
    style={isNew ? newContainerStyle : currentContainerStyle}
  >
    <Typography.Text style={titleStyle}>{title}</Typography.Text>

    <Flex style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['name'])}>
        Name:
      </Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['name'])}>
        {name}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text
        style={getItemTitleStyle(differences['linkedLeagueName'])}
      >
        Linked League/Tourn:
      </Typography.Text>
      <Typography.Text
        style={getItemValueStyle(differences['linkedLeagueName'])}
      >
        {linkedLeagueName}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['startDate'])}>
        Start date:
      </Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['startDate'])}>
        {startDate}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text
        style={getItemTitleStyle(differences['expectedEndDate'])}
      >
        Expected end date:
      </Typography.Text>
      <Typography.Text
        style={getItemValueStyle(differences['expectedEndDate'])}
      >
        {expectedEndDate}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['playoffFormat'])}>
        Playoff format:
      </Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['playoffFormat'])}>
        {playoffFormat}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text
        style={getItemTitleStyle(differences['standingsFormat'])}
      >
        Standings format:
      </Typography.Text>
      <Typography.Text
        style={getItemValueStyle(differences['standingsFormat'])}
      >
        {standingsFormat}
      </Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text
        style={getItemTitleStyle(differences['tiebreakersFormat'])}
      >
        Tiebreakers format:
      </Typography.Text>
      <Typography.Text
        style={getItemValueStyle(differences['tiebreakersFormat'])}
      >
        {tiebreakersFormat}
      </Typography.Text>
    </Flex>
  </Flex>
)

export default SeasonDetailsColumn
