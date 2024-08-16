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
  title: string
  isNew: boolean
  differences: Record<keyof ISeasonReviewUpdateData, boolean>
  isDivisionOrSubdivisionChanged: boolean
}

const SeasonDetailsColumn: FC<ISeasonDetailsColumn> = ({
  differences,
  expectedEndDate,
  isNew,
  linkedLeagueName,
  name,
  startDate,
  title,
  divisions,
  isDivisionOrSubdivisionChanged,
}) => (
  <Flex flex="1 1 50%" vertical style={isNew ? newContainerStyle : currentContainerStyle}>
    <Typography.Text style={titleStyle}>{title}</Typography.Text>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['name'])}>Name:</Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['name'])}>{name}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['linkedLeagueName'])}>Linked League/Tourn:</Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['linkedLeagueName'])}>{linkedLeagueName}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['startDate'])}>Start date:</Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['startDate'])}>{startDate}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(differences['expectedEndDate'])}>Expected end date:</Typography.Text>
      <Typography.Text style={getItemValueStyle(differences['expectedEndDate'])}>{expectedEndDate}</Typography.Text>
    </Flex>

    <Flex vertical style={itemContainerStyle}>
      <Typography.Text style={getItemTitleStyle(isDivisionOrSubdivisionChanged)}>Division/Pool</Typography.Text>

      <ul style={{ listStyle: 'none' }}>
        {divisions.map((division, idx) => (
          <li key={division.name}>
            <Flex vertical>
              <Typography.Text style={getItemValueStyle(isDivisionOrSubdivisionChanged)}>
                {idx + 1} {division.name}:
              </Typography.Text>

              <ul style={{ listStyle: 'none' }}>
                {division.sub_division.map((subdivision, i) => (
                  <li key={subdivision.name} style={getItemValueStyle(isDivisionOrSubdivisionChanged)}>
                    <Typography style={getItemValueStyle(isDivisionOrSubdivisionChanged)}>
                      {i + 1} {subdivision.name}
                    </Typography>

                    <Typography style={getItemTitleStyle(isDivisionOrSubdivisionChanged)}>
                      PF - {subdivision.playoff_format}, SF - {subdivision.standings_format}, TF -{' '}
                      {subdivision.tiebreakers_format}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Flex>
          </li>
        ))}
      </ul>
    </Flex>
  </Flex>
)

export default SeasonDetailsColumn
