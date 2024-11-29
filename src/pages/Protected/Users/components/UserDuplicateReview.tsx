import { RoleList } from './RoleList.tsx'
import styled from '@emotion/styled'
import { Flex, Typography } from 'antd'
import { FULL_GENDER_NAMES } from '@/common/constants'
import { TGender } from '@/common/types'
import { compareObjects } from '@/utils/compareObjects.ts'
import { IExtendedFEUser, IFENew } from '@/common/interfaces/user.ts'
import { ReactElement, useCallback } from 'react'
import { IDuplicate } from '@/common/interfaces'
import { formatPhoneNumber } from '@/utils'
import { TLinkedRole } from '@/common/types/users.ts'

type TUserDuplicate = Omit<IDuplicate<IFENew, IExtendedFEUser>, 'differences'>

interface IDuplicateReviewProps {
  index: number
  duplicates: TUserDuplicate[]
  linkedRoles: TLinkedRole[]
  newRoles: TLinkedRole[]
}

/**
 * UserDuplicateReview Component
 *
 * This component is designed to review and compare user duplicates, displaying both existing and newly imported user information.
 *
 * @param {IDuplicateReviewProps} props - The properties for the UserDuplicateReview component, including:
 * - `index`: The index of the current duplicate being reviewed.
 * - `duplicates`: An array of user duplicates, each containing existing and new user data.
 * - `linkedRoles`: An array of roles linked to the existing user.
 * - `newRoles`: An array of new roles linked to the imported user.
 *
 * @returns {ReactElement} A JSX element containing two sections:
 * - **Current**: Displays immutable information of the existing user, such as name, gender, email, birthdate, phone, zip code, and current roles.
 * - **Imported**: Displays the same immutable information for the new user and highlights differences, including new roles if they are present.
 */
const UserDuplicateReview = (props: IDuplicateReviewProps): ReactElement => {
  const { duplicates, index, linkedRoles, newRoles } = props
  const { existing, 'new': newUser } = duplicates[index]

  const differences: Record<Partial<keyof IFENew>, boolean> = compareObjects(newUser, existing)

  const renderImmutableInfo = useCallback(() => (
    <>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Name:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.firstName} {existing.lastName}</ItemValueStyle>
      </Flex>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Gender:</ItemTitle>
        <ItemValueStyle
          is_changed={`false`}>{existing.gender ? FULL_GENDER_NAMES[existing.gender as TGender] : '-'}</ItemValueStyle>
      </Flex>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Email:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.email || '-'}</ItemValueStyle>
      </Flex>
      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Birth Date:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.birthDateFormatted}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Phone:</ItemTitle>
        <ItemValueStyle
          is_changed={`false`}>{existing.phoneNumber ? formatPhoneNumber(existing.phoneNumber) : '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Zip Code:</ItemTitle>
        <ItemValueStyle is_changed={`false`}>{existing.zipCode || '-'}</ItemValueStyle>
      </Flex>

      <Flex className="mg-b16" vertical>
        <ItemTitle is_changed={`false`}>Current Roles:</ItemTitle>
        {!existing.roles?.length && (
          <ItemValueStyle is_changed={`false`}>-</ItemValueStyle>
        )}
        <RoleList roles={linkedRoles} />
      </Flex>
    </>
  ), [duplicates, existing, linkedRoles, newRoles])

  return (
    <Flex className="w-790">
      <Container is_newUser={`false`}>
        <Title>Current</Title>

        {renderImmutableInfo()}
      </Container>

      <Container is_newUser={`true`}>
        <Title>Imported</Title>

        {renderImmutableInfo()}

        {differences.roles && !!newRoles?.length && (
          <Flex className="mg-b16" vertical>
            <ItemTitle is_changed={`true`}>New Roles:</ItemTitle>
            {!!newRoles?.length && <RoleList roles={newRoles} isNew={true} />}
          </Flex>
        )}
      </Container>
    </Flex>
  )
}

export default UserDuplicateReview


const Container = styled(Flex)<{ is_newUser: string }>`
    flex: 1 1 50%;
    flex-direction: column;
    border-right: ${(props) => (props.is_newUser === 'true' ? '0' : '2px solid #F4F4F5')};
    padding-left: ${(props) => (props.is_newUser !== 'true' ? '0' : '16px')};
    padding-right: ${(props) => (props.is_newUser !== 'true' ? '16px' : '0')};
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
