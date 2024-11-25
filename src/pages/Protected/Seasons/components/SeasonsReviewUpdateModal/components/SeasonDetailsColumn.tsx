import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import { FC } from 'react'

import { ISeasonReviewUpdateData } from '@/common/interfaces/season'

const Container = styled(Flex)<{ is_new: string }>`
  flex: 1 1 50%;
  flex-direction: column;
  border-right: ${(props) => (props.is_new === 'true' ? '0' : '2px solid #F4F4F5')};
  padding-left: ${(props) => (props.is_new !== 'true' ? '0' : '16px')};
  padding-right: ${(props) => (props.is_new !== 'true' ? '16px' : '0')};
`

const Title = styled(Typography)`
  color: #888791;
  font-size: 14px;
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
  <Container is_new={`${isNew}`}>
    <Title>{title}</Title>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`${!!differences['name']}`}>Name:</ItemTitle>
      <ItemValueStyle is_changed={`${!!differences['name']}`}>{name}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`${!!differences['linkedLeagueName']}`}>Linked League/Tourn:</ItemTitle>
      <ItemValueStyle is_changed={`${!!differences['linkedLeagueName']}`}>{linkedLeagueName}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`${!!differences['startDate']}`}>Start date:</ItemTitle>
      <ItemValueStyle is_changed={`${!!differences['startDate']}`}>{startDate}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`${!!differences['expectedEndDate']}`}>Expected end date:</ItemTitle>
      <ItemValueStyle is_changed={`${!!differences['expectedEndDate']}`}>{expectedEndDate}</ItemValueStyle>
    </Flex>

    <Flex className="mg-b16" vertical>
      <ItemTitle is_changed={`${!!isDivisionOrSubdivisionChanged}`}>Division/Pool</ItemTitle>

      <ul className="ls-n ">
        {divisions.map((division, idx) => (
          <li key={division.name}>
            <Flex vertical>
              <ItemValueStyle is_changed={`${!!isDivisionOrSubdivisionChanged}`}>
                {idx + 1} {division.name}:
              </ItemValueStyle>

              <ul className="ls-n ">
                {division.sub_division.map((subdivision, i) => (
                  <ItemValueStyle is_changed={`${!!isDivisionOrSubdivisionChanged}`}>
                    <ItemValueStyle is_changed={`${!!isDivisionOrSubdivisionChanged}`}>
                      {i + 1} {subdivision.name}
                    </ItemValueStyle>

                    <ItemValueStyle is_changed={`${!!isDivisionOrSubdivisionChanged}`}>
                      PF - {subdivision.playoff_format}, SF - {subdivision.standings_format}, TF -{' '}
                      {subdivision.tiebreakers_format}
                    </ItemValueStyle>
                  </ItemValueStyle>
                ))}
              </ul>
            </Flex>
          </li>
        ))}
      </ul>
    </Flex>
  </Container>
)

export default SeasonDetailsColumn
