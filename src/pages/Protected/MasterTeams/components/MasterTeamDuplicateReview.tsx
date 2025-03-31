import { IFEDuplicate } from '@/common/interfaces/masterTeams.ts'
import { Flex, Typography } from 'antd'
import styled from '@emotion/styled'
import { ReactElement } from 'react'

interface IDuplicateReviewProps {
  /**
   * The index of the duplicate to render.
   */
  index: number
  /**
   * Array of duplicates containing current (existing) and new (imported) data.
   */
  duplicates: IFEDuplicate[]
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
export const MasterTeamDuplicateReview = (props: IDuplicateReviewProps): ReactElement => {
  const { duplicates, index } = props
  const current = duplicates[index]

  return (
    <Flex className="w-790">
      <Container is_new={`false`}>
        <Title>Current</Title>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Name:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.name}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Team Administrator:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.teamAdmins.join(', ')}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Team Admin Email:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.teamAdminsEmails.join(', ')}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Head Coach:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.headCoach || '-'}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`false`}>Head Coach Email:</ItemTitle>
          <ItemValueStyle is_changed={`false`}>{current.existing.headCoachEmail || '-'}</ItemValueStyle>
        </Flex>
      </Container>

      <Container is_new={`true`}>
        <Title>Imported</Title>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.masterTeamName)}`}>Name:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences.masterTeamName)}`}>{current.new.masterTeamName}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.teamAdminName)}`}>Team Administrator:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences.teamAdminName)}`}>{current.new.teamAdminName || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.teamAdminEmail)}`}>Team Admin Email:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences.teamAdminEmail)}`}>{current.new.teamAdminEmail || '-'}</ItemValueStyle>
        </Flex>
        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.headCoachName)}`}>Head Coach:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences.headCoachName)}`}>{current.new.headCoachName || '-'}</ItemValueStyle>
        </Flex>

        <Flex className="mg-b16" vertical>
          <ItemTitle is_changed={`${(!!current.differences.headCoachEmail)}`}>Head Coach Email:</ItemTitle>
          <ItemValueStyle
            is_changed={`${(!!current.differences.headCoachEmail)}`}>{current.new.headCoachEmail || '-'}</ItemValueStyle>
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
