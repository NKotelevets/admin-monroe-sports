import { Flex, Typography } from 'antd'
import styled from '@emotion/styled'
import { ReactElement } from 'react'
import { TLeagueTeamDuplicate } from '@/common/types/leagueTeams.ts'

interface IDuplicateReviewProps {
  /**
   * The index of the duplicate to render.
   */
  index: number
  /**
   * Array of duplicates containing current (existing) and new (imported) data.
   */
  duplicates: TLeagueTeamDuplicate[]
}

/**
 * Component to render and compare duplicate team data side-by-side.
 * Displays the "Current" team data and the "Imported" (new) data with visual highlights
 * for fields that have changed.
 *
 * @param {IDuplicateReviewProps} props - The props for the component.
 * @param {number} props.index - Index of the duplicate object to display from the duplicates array.
 * @param {IFEDuplicate[]} props.duplicates - Array of duplicate objects containing current and imported data.
 *
 * @returns {ReactElement} The rendered component displaying the duplicate data comparison.
 */
export const LeagueTeamDuplicateReview = (props: IDuplicateReviewProps): ReactElement => {
  const { duplicates, index } = props
  const current = duplicates[index]

  return (
    <Flex className="w-790">
      <Container is_new={`false`}>
        <Title>Current</Title>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>League Team Name:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences?.leagueTeamName)}`}>{current.existing.leagueTeamName}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Linked League/Tourn:</ItemTitle>
          <ItemValueStyle is_changed={`${(!!current.differences?.leagueName)}`}>{current.existing.leagueName}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.divisionName)}`}>Division/Pool:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.divisionName}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.subdivisionName)}`}>Subdivision/Pool:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.subdivisionName}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.masterTeamName)}`}>Master Team Name:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.masterTeamName}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.mtAdminName)}`}>Team Administrator:</ItemTitle>
          {current.existing.mtAdminNames?.map(name => (
            <ItemValueStyle is_changed={`false`}>{name}</ItemValueStyle>
          )) || <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>}
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.mtAdminEmail)}`}>Team Admin Email:</ItemTitle>
          {current.existing.mtAdminEmails?.map(email => (
            <ItemValueStyle is_changed={`false`}>{email}</ItemValueStyle>
          )) || <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>}
        </Flex>
      </Container>

      <Container is_new={`true`}>
        <Title>Imported</Title>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.leagueTeamName)}`}>League Team Name</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.leagueTeamName)}`}>{current.new.leagueTeamName}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.leagueName)}`}>Linked League/Tourn:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.leagueName)}`}>{current.new.leagueName || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.divisionName)}`}>Division/Pool:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.divisionName)}`}>{current.new.divisionName || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.subdivisionName)}`}>Subdvision/Pool:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.subdivisionName)}`}>{current.new.subdivisionName || '-'}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.masterTeamName)}`}>Master Team Name:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.masterTeamName)}`}>{current.new.masterTeamName || '-'}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.mtAdminName)}`}>Team Administrator:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.mtAdminName)}`}>{current.new.mtAdminName || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences?.mtAdminEmail)}`}>Team Admin Email:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences?.mtAdminEmail)}`}>{current.new.mtAdminEmail || '-'}</ItemValueStyle>
        </Flex>
      </Container>
    </Flex>
  )
}

// Styled Components
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
